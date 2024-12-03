import { getDocs, collection, where, query, orderBy, updateDoc, addDoc, doc, deleteDoc, getDoc, writeBatch, setDoc } from 'firebase/firestore'
import { auth, db, storage } from '../firebase/config'
import { deleteObject, ref } from 'firebase/storage';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import bcrypt from 'bcryptjs';

export default function useFetchData() {

    async function getData(collectionName){
        const dataCollection = collection(db, collectionName);
        const snapshot = await getDocs(dataCollection);
      
        const docsList = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        return docsList;
    }

    async function getDataById(collectionName, id){
        try {
            const docRef = doc(db, collectionName, id);
            const docSnap = await getDoc(docRef);
        
            if (docSnap.exists()) {
                return {id: docSnap.id, ...docSnap.data()};
            } else {
                console.log("Nenhum documento encontrado!");
                return null;
            }
        } catch (error) {
            console.error("Erro ao buscar documento:", error);
        }
    }

    async function getDataByQuery(collectionName, field , operator, value) {
        const dataCollection = collection(db, collectionName);
        const q = query(dataCollection, where(field, operator, value));

        const snapshot = await getDocs(q);
        const docsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return docsList;
    }

    async function getOrderedData(collectionName, orderField, orderDirection) {
        try {
            const dataCollection = collection(db, collectionName);    
            const q = query(dataCollection, orderBy(orderField, orderDirection));
    
            const snapshot = await getDocs(q);
            const docsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            return docsList;
        } catch (error) {
            console.error("Erro ao obter os dados ordenados:", error);
            throw error;
        }
    }

    async function getQueryAndOrderedData(collectionName, field, operator, value, orderField, orderDirection = "asc") {
        try {
            const dataCollection = collection(db, collectionName);
            const q = query(
                dataCollection,
                where(field, operator, value),
                orderBy(orderField, orderDirection)
            );
    
            const snapshot = await getDocs(q);
            const docsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            return docsList;
        } catch (error) {
            console.error("Erro ao obter os dados filtrados e ordenados:", error);
            throw error;
        }
    }

    async function setData(collectionName, data) {
        try {
            const dataCollection = collection(db, collectionName);
            const docRef = await addDoc(dataCollection, data);
            console.log("Documento adicionado com ID:", docRef.id);
            return docRef.id; 
        } catch (error) {
            console.error("Erro ao adicionar documento:", error);
            throw error; 
        }
    }

    async function createUser(email, password, additionalData = {}) {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const userId = userCredential.user.uid;
        
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);
        
            const userData = {
                email,
                password: hashedPassword,
                ...additionalData,
            };
        
            await setDoc(doc(db, 'users', userId), userData);

            console.log('Usuário criado com sucesso e salvo no Firestore!');
            return userId;
        } catch (error) {
            console.error('Erro ao criar o usuário:', error.message);
            throw error;
        }
    }

    async function deleteUser(userUid, adminUid) {
        const functionUrl = `https://mkt-admin-api.vercel.app/api/users/delete/${userUid}`;
        
        try {
            const response = await fetch(functionUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({adminUid: adminUid})
            });
        
            if (!response.ok) {
                throw new Error(`Erro: ${response.statusText}`);
            }
        
            const data = await response.json();
            console.log(data.message);
        } catch (error) {
            console.error('Erro ao deletar o usuário:', error.message);
        }
    }

    async function updateData(collectionName, docId, newData) {
        try {
            const docRef = doc(db, collectionName, docId); 
            await updateDoc(docRef, newData); 
            console.log("Documento atualizado com sucesso");
        } catch (error) {
            console.error("Erro ao atualizar documento:", error);
            throw error;
        }
    }

    async function deleteData(collectionName, docId) {
        try {
            const docRef = doc(db, collectionName, docId); 
            await deleteDoc(docRef); 
            console.log("Documento deletado com sucesso");
        } catch (error) {
            console.error("Erro ao deletar documento:", error);
            throw error;
        }
    }

    async function deleteDataInBatchWithQuery(collectionName, field, operator, value) {
        try {
            const q = query(collection(db, collectionName), where(field, operator, value));
            const querySnapshot = await getDocs(q);

            const deleteImagePromises = [];
            const batch = writeBatch(db);

            querySnapshot.docs.forEach((document) => {
                const data = document.data();
                if (data.image) {
                    const imageRef = ref(storage, data.image);
                    deleteImagePromises.push(deleteObject(imageRef));
                }
                batch.delete(document.ref);
            });

            await Promise.all(deleteImagePromises);
            await batch.commit();

            console.log("Documentos e imagens deletados em batch com sucesso!");
        } catch (error) {
            console.error("Erro ao deletar documentos e imagens em batch:", error);
        }
      }

    function extractFilePathFromURL(downloadURL) {
        // Extraia o caminho do arquivo entre "/o/" e "?"
        const regex = /\/o\/(.*?)\?/;
        const match = downloadURL.match(regex);
      
        if (match && match[1]) {
          // Decodifica o caminho URL-encoded
          return decodeURIComponent(match[1]);
        }
      
        throw new Error("Caminho do arquivo não encontrado na URL");
    }

    async function deleteImageByDownloadURL(downloadURL) {
        try {
            const filePath = extractFilePathFromURL(downloadURL);
            const fileRef = ref(storage, filePath);
        
            await deleteObject(fileRef);
            console.log("Imagem deletada com sucesso!");
        } catch (error) {
            console.error("Erro ao deletar a imagem:", error);
            if (error.code === 'storage/object-not-found') {
                console.log('O arquivo não foi encontrado.');
            }
        }
    }

    return { getData, getDataById, getDataByQuery, getOrderedData, getQueryAndOrderedData, setData, createUser, deleteUser, updateData, deleteData, deleteDataInBatchWithQuery, deleteImageByDownloadURL }
}
