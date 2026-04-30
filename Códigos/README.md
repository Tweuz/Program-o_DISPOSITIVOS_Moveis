# Sistema de Gestão Paroquial - Projeto Acadêmico

## Descrição do Projeto
Este aplicativo foi desenvolvido como parte de uma atividade educacional para a disciplina de desenvolvimento mobile. O objetivo central é criar uma plataforma funcional que facilite a interação entre a administração de uma paróquia e seus fiéis, servindo como uma ferramenta de comunicação moderna para a divulgação de horários, eventos e campanhas sociais.

A proposta do trabalho é aplicar conceitos fundamentais de desenvolvimento de software, como persistência de dados em tempo real, autenticação de usuários, gerenciamento de permissões (Administrador vs. Fiel) e design de interface adaptável (Modo Claro e Escuro).

## Funcionalidades e Regras de Negócio

### Sistema de Autenticação e Níveis de Acesso
O fluxo de entrada do aplicativo é regido por uma lógica de verificação de perfil vinculada ao Firebase Authentication e Firestore.
* **Perfil Fiel:** Possui acesso visual aos horários de missas, confissões e detalhes das pastorais. Pode visualizar a oração do dia e informações sobre campanhas de doação.
* **Perfil Administrador:** Além de todas as funcionalidades de consulta, o administrador possui privilégios de edição. Ele pode alterar a oração do dia, gerenciar (adicionar ou remover) horários de missas e confissões, e controlar os itens necessários para as campanhas de alimentos.

### Funcionalidades Internas
* **Agenda Dinâmica:** O sistema filtra automaticamente os eventos para exibir o que ocorre no dia atual na tela principal.
* **Campanha de Alimentos:** Gerenciamento de metas para arrecadação de itens de cesta básica.
* **Personalização:** Implementação de um tema escuro (Dark Mode) para melhor acessibilidade e conforto visual.
* **Segurança da Conta:** O usuário possui opções para recuperação de senha e exclusão permanente da conta, exigindo reautenticação para operações críticas.

## Arquitetura do Código
O projeto foi desenvolvido em React Native utilizando a estrutura do Expo. A organização do código separa as interfaces de usuário da lógica de serviços de backend.
* **Integração com Firebase:** O aplicativo utiliza `onSnapshot` para garantir que as informações exibidas na tela (como novos horários de missa) sejam atualizadas em tempo real para todos os usuários assim que o administrador realiza uma alteração.
* **Navegação:** A transição entre telas é gerenciada por estados internos, garantindo que o fluxo entre Login, Cadastro e a Interface Principal ocorra de maneira fluida.

## Download e Avaliação
Para fins de avaliação e teste da aplicação, o pacote de instalação (APK) para Android pode ser acessado através do link oficial de distribuição do Expo:

[Download do APK - Build Details](https://expo.dev/accounts/mateus_onival/projects/Appzinho/builds/3336cce3-200d-4fc9-85e8-2776a32f3ea3)

---
*Este documento foi gerado para documentação de atividade acadêmica.*
