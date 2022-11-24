# Requisitos do Projeto do Módulo 5 - Backend 2

## Requisitos da PRIMEIRA ENTREGA:

- Minimo um CRUD completo com swagger implementado (3 pontos);
- Status code corretos no CRUD ja implementado (1 ponto);
- Persistência de Dados no SQL com prisma (2 pontos);
- Formatação de código utilizando Prettier/ESLint (1 ponto);
- Tratamento de erros (1 ponto);
- Utilização do ClassValidator para validar os dados da entidade (2 pontos);

## Requisitos da ENTREGA FINAL:

Autenticação e usuários:
Estrutura (mínima da entidade)

- Name;
- Email;
- Password;
- CPF;
- isAdmin; (pode usar role caso tenha interesse)

Um usuário poderá ter mais de um perfil:
Estrutura (mínima da entidade):

- Title;
- ImageURL;

Poderá criar uma entidade livre com no mínimo 7 campos (abordando obrigatoriamente pelo menos 3 tipos primitivos)
Alguns tipos primitivos:

- Int;
- Decimal (float);
- DateTime (Date);
- Boolean;
- Array;
  Obrigatoriamente o perfil terá que poder realizar alguma interação com essa entidade.
  Alguns exemplos de interação: Like, adicionar ao carrinho, favoritar, comprar, comentário, avaliação...

Relações:
Será necessário ter no mínimo 3 relações entre as tabelas.
Podendo ser elas 1:n (1 para muitos) ou n:n (muitos para muitos).
Dica: Você já terá necessariamente uma relação 1:n de usuário:perfis (um usuário poderá ter vários perfis).

Endpoints:
O mínimo exigido será:

- [Create]: Usuários (não precisa de autenticação);
- [AUTH] [GET]: Homepage Com um array das entidades e também uma lista com as entidades que o usuário teve alguma interação;
- [AUTH] [CRUD]: CRUD autenticado das entidades, para criar deletar etc. E também endpoints para o perfil interagir com a mesma;
- [AUTH] [ADMIN] [CRUD]: CRUD de Usuários (apenas admins podem gerenciar usuários);
