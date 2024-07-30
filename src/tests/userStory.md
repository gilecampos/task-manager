# Histórias de Usuário para a Aplicação de Lista de Tarefas

## Registro de Usuário

1. **Como um usuário, eu quero registrar uma conta para que eu possa criar uma lista de tarefas pessoal.**

   **Critérios de Aceitação:**
   - O usuário deve fornecer um nome de usuário, e-mail e senha.
   - A senha deve ser criptografada de forma segura antes de ser armazenada.
   - Se o registro for bem-sucedido, o usuário deve ser redirecionado para a página de login.
   - Se o nome de usuário ou e-mail já estiver em uso, uma mensagem de erro apropriada deve ser exibida.

   **Testes:**
   - **Deve registrar um usuário com dados válidos**
     - Dado os detalhes de registro válidos
     - Quando o usuário envia o formulário de registro
     - Então o usuário deve ser registrado com sucesso e redirecionado para a página de login.

   - **Não deve registrar um usuário com um nome de usuário ou e-mail já existente**
     - Dado um nome de usuário ou e-mail que já está em uso
     - Quando o usuário tenta se registrar com esse nome de usuário ou e-mail
     - Então o usuário deve receber uma mensagem de erro indicando que o nome de usuário ou e-mail já está em uso.

   - **Deve armazenar a senha como um hash**
     - Dado os detalhes de registro válidos
     - Quando o usuário é registrado
     - Então a senha armazenada deve ser criptografada, e a senha original não deve ser recuperável.

## Login de Usuário

2. **Como um usuário registrado, eu quero fazer login na aplicação para que eu possa acessar minhas tarefas.**

   **Critérios de Aceitação:**
   - O usuário deve fornecer um nome de usuário ou e-mail e senha.
   - Se as credenciais forem válidas, o usuário deve ser autenticado e redirecionado para a página da lista de tarefas.
   - Se as credenciais forem inválidas, uma mensagem de erro apropriada deve ser exibida.

   **Testes:**
   - **Deve fazer login com credenciais válidas**
     - Dado um nome de usuário ou e-mail registrado e senha correta
     - Quando o usuário envia o formulário de login
     - Então o usuário deve ser autenticado e redirecionado para a página da lista de tarefas.

   - **Não deve fazer login com credenciais inválidas**
     - Dado um nome de usuário ou senha incorretos
     - Quando o usuário tenta fazer login
     - Então o usuário deve receber uma mensagem de erro indicando credenciais inválidas.

   - **Deve redirecionar usuários autenticados corretamente**
     - Dado um login bem-sucedido
     - Quando o usuário é autenticado
     - Então o usuário deve ser redirecionado para a página da lista de tarefas.

## Criação de Tarefas

3. **Como um usuário autenticado, eu quero adicionar novas tarefas para que eu possa gerenciar minhas atividades.**

   **Critérios de Aceitação:**
   - O usuário deve fornecer um título e pode opcionalmente fornecer uma descrição, data de vencimento e status.
   - A tarefa deve estar associada ao usuário autenticado.
   - Se a tarefa for adicionada com sucesso, ela deve ser exibida na lista de tarefas do usuário.

   **Testes:**
   - **Deve adicionar uma tarefa com todos os campos preenchidos**
     - Dado detalhes válidos da tarefa, incluindo título, descrição, data de vencimento e status
     - Quando o usuário adiciona a tarefa
     - Então a tarefa deve ser criada com sucesso e exibida na lista de tarefas do usuário.

   - **Deve adicionar uma tarefa com apenas o título**
     - Dado que apenas um título é fornecido
     - Quando o usuário adiciona a tarefa
     - Então a tarefa deve ser criada com valores padrão para outros campos e exibida na lista de tarefas do usuário.

   - **Deve associar a tarefa ao usuário correto**
     - Dado que um usuário autenticado adiciona uma tarefa
     - Quando a tarefa é criada
     - Então a tarefa deve estar vinculada ao usuário que a criou.

## Listagem de Tarefas

4. **Como um usuário autenticado, eu quero ver uma lista de todas as minhas tarefas para que eu possa acompanhar meu progresso.**

   **Critérios de Aceitação:**
   - A lista deve exibir o título, descrição, status e data de vencimento de cada tarefa.
   - Apenas as tarefas pertencentes ao usuário autenticado devem ser exibidas.

   **Testes:**
   - **Deve exibir todas as tarefas do usuário autenticado**
     - Dado um usuário autenticado com várias tarefas
     - Quando o usuário visualiza sua lista de tarefas
     - Então todas as tarefas associadas ao usuário devem ser exibidas com seus detalhes.

   - **Não deve exibir tarefas de outros usuários**
     - Dado um usuário autenticado
     - Quando o usuário visualiza sua lista de tarefas
     - Então a lista de tarefas não deve incluir tarefas de outros usuários.
