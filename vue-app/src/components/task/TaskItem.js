/* vue-app/src/components/task/TaskItem.js  */
export default {
  name: "TaskItem",
  props: {
    task: {
      type: Object,
      required: true,
    },
    userRole: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      isEditing: false,
      editableTitle: this.task.title,
    };
  },
  watch: {
    /* Garante que o campo de edição seja atualizado se a tarefa for recarregada externamente */
    "task.title"(newTitle) {
      this.editableTitle = newTitle;
    },
  },
  methods: {
    startEdit() {
      this.isEditing = true;
      /* Selecionar o input após a renderização (opcional) */
      this.$nextTick(() => {
        this.$el.querySelector(".edit-input").focus();
      });
    },
    saveEdit() {
      /* Verifica se o título mudou e não está vazio antes de emitir o evento */
      if (this.editableTitle.trim() && this.editableTitle !== this.task.title) {
        // Emite o evento 'update-task' para o componente pai (App.vue)
        this.$emit("update-task", this.task.id, { title: this.editableTitle });
      }
      this.isEditing = false;
    },
    handleClick() {
      // Se a tarefa já está concluída, não faz sentido editar ou selecionar (opcional)
      if (this.task.completed) {
        this.$emit('select-task', this.task.id);
        return;
      }

      // Se o título está sendo editável ao clicar (com um duplo clique para edição real)
      // você pode escolher entre navegação ou edição. Vou priorizar a navegação.

      // Emite o evento para navegação
      this.$emit('select-task', this.task.id);
    },
  },
};