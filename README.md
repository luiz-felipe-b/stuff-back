![logo_github](https://github.com/user-attachments/assets/0996030e-2a81-49a9-8a52-dabd172f1121)
# Stuff Back-end 🐶
### Mas o que é Stuff? 🤔
Stuff é um sistema de organizamento de ativos projetado para uso de diversos níveis, desde o pequeno comerciante que tem que manter um pequeno comércio até grandes varejistas. O uso do sistema não se restringe somente a esse tipo de coisa contudo, você pode gerenciar equipamentos de incêndio, estoque de alimentos e até a ração do seu dog!
### Qual problema o Stuff se propõe a resolver? 🎯
O sistema se propõe a resolver um problema de performance e dificuldade ao gerenciar ativos. Stuff é para ser notável em diversos aspectos: qualidade de software, complexidade, utilidade, usabilidade, entre outros.   
### Qual a história do Stuff? 📖
O projeto nasceu de uma parceria na faculdade com o Metrô de São Paulo, aonde um time de estudantes desenvolveu um sistema de gerenciamento de equipamentos de incêndio. Durante o projeto com o Metrô, percebemos que não ter um sistema que automatiza essa parte de monitoramento de ativos resulta em custos muito grandes a longo prazo, eles gastavam muitos funcionários e tempo para dar conta de registrar tantos equipamentos de incêndio na base do papel e caneta. 

Só o tempo de preencher formulários em papel e passá-los para o digital já levava 1 semana de acordo com a equipe do Metrô. Sabendo disso, a nossa equipe, com o apoio de um de nossos docentes, implementou uma solução utilizando tecnologias RFID, aonde ela funciona por meio da dinâmica Scanner-Tag, o funcionário inspetor dos equipamentos teria um scanner RFID e cada equipamento uma tag RFID que referencia à aquele equipamento em específico. Ao escanear a tag, o inspetor tem acesso às informações do equipamento e assim ele pode modificá-las caso necessário.

O nosso resultado foi um sistema dinâmico, rápido e fácil de usar. Os clientes e os docentes adoraram e nosso projeto recebeu muitos elogios. Stuff é o sucessor desse sistema, ele se orgulha de ser mais flexível que o anterior, suportando vários modos de manipulação dos ativos. Manualmente, por meio de QR codes ou até as mesmas tags RFID utilizadas no antigo projeto.

## Arquitetura utilizada 🏛️
O sistema dispõe de uma arquitetura monolítica separada em módulos que são separados em camadas, cada uma tem uma responsabilidade específica e cada módulo representa um domínio da aplicação. Por enquanto temos os módulos:
- <strong>auth</strong> - Módulo de autenticação
- <strong>user</strong> - Módulo que mantém usuários.
- <strong>organizations</strong> - Módulo que mantém organizações.
- <strong>items</strong> - Módulo que mantém os ativos e seus atributos.

E cada um deles tem as camadas:
- <strong>routes</strong> - Camada que expõe as rotas para o cliente
- <strong>controllers</strong> - Camada que obtém as requisições e determina com a resposta será formada.
- <strong>services</strong> - Camada que encapsula a lógica e as regras de negócio do sistema.
- <strong>repositories</strong> - Camada que interage diretamente com a base de dados.
  
### Diagrama da arquitetura

![diagrama_arquitetura_api](https://github.com/user-attachments/assets/a33dd886-7cc9-416b-b62d-dfb0650c46bb)
<sub>Diagrama feito apenas para fins de ilustrar a dinâmica cliente-servidor, não demonstra a API de fato.</sub>

## Stack utilizada 📚
Utilizamos uma stack orientada a Node.js utilizando o ferramental mais atual do mercado:  

**Linguagens de programação:** Javascript e Typescript  

**Ferramentas e Frameworks:** Node.js e Fastify  

**ORM:** Drizzle-ORM  

**Bancos de dados:** PostgreSQL  

**Bibliotecas adicionais:** Zod, Swagger e Jest  

## O que vem agora? 🔍
Estamos nos esforçando muito para finalizar o Stuff e o entregá-lo o mais rápido e o mais bem feito possível. Siga esse [perfil do LinkedIn](https://www.linkedin.com/in/luiz-felipe-balaminute-dos-santos-881667289/) para mais atualizações.

