# Desconto Sustentável (Admin Panel)

O painel administrador permite o gerenciamento de produtos, categorias e usuários do aplicativo Desconto Sustentável, o qual é uma plataforma focada em reduzir o desperdício de alimentos, oferecendo produtos alimentícios com desconto e próximos da data de validade. O serviço conecta consumidores com varejistas e produtores que têm itens alimentícios que precisam ser vendidos rapidamente. Os usuários podem encontrar uma grande variedade de produtos, como mantimentos, refeições prontas e muito mais, todos com preços reduzidos devido à proximidade da data de validade. Esta iniciativa ajuda tanto o meio ambiente, minimizando o desperdício de alimentos, quanto os consumidores, fornecendo produtos acessíveis e de qualidade.

<p align="center">
  <img src="https://github.com/user-attachments/assets/89d23b0f-0999-4881-91f9-131ad8a224bd" alt="Image 2" width="70%">
  <img src="https://github.com/user-attachments/assets/1cdb74f4-6921-4639-bfe5-7f6b85cb7ed3" alt="Image 1" width="29%">
</p>

## Tecnologia

Projeto criado com ReactJS + Vite. O banco de dados utilizado é o Firebase Cloud Firestore.

## Configuração

- Instale o NodeJS;<br/>

- Instale as dependências com o comando "npm install" no diretório do projeto;<br/>

- Crie um arquivo .env na pasta raíz do projeto e adicione a URL do backend e as variáveis de conexão do Firebase ao arquivo, como no exemplo abaixo:
```
VITE_API_URL = "https://mkt-admin-api.vercel.app"

VITE_FIREBASE_API_KEY = "AIzaSy1234567890abcdefgHIJKLMNOPQRST"
VITE_FIREBASE_AUTH_DOMAIN = "exemplo-app.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID = "exemplo-app"
VITE_FIREBASE_STORAGE_BUCKET = "exemplo-app.firebasestorage.app"
VITE_FIREBASE_MESSAGING_SENDER_ID = "123456789012"
VITE_FIREBASE_APP_ID = "1:123456789012:web:abcdef1234567890abcdef"
```
As variáveis do Firebase, são necessárias para se conectar ao banco de dados. Elas podem ser obtidas pelo site, nas configurações do projeto, em "Apps da Web". E a URL da API é utilizada para ações que exigem do firebase-admin, como a de deletar usuários.<br/>

- Utilize "npm run dev" para iniciar o aplicativo no modo desenvolvimento.

## Autores

- José Robson Cabral (Aluno do PPGASA);<br/>

- Paulo Rogério Barbosa (Orientador);<br/>

- Matheus Pedrosa Souza (Desenvolvedor do sistema);<br/>

- Mozart de Melo Alves (Coordenador do núcleo de pesquisa).