<template>
    <pv-card class="task-card-prime" :class="{ 'completed-task': task.completed }" @click="$emit('select-task', task.id)">
        
        <template #title>
            <div class="header-row">
                <div class="left-content">
                    <input 
                        type="checkbox" 
                        class="native-checkbox"
                        :checked="task.completed" 
                        @change="$emit('toggle-complete', task.id, !task.completed)" 
                        @click.stop 
                    />
                    
                    <input 
                        v-if="isEditing" 
                        type="text" 
                        v-model="editableTitle" 
                        class="prime-input-text" 
                        @keyup.enter="saveEdit" 
                        @click.stop 
                    />
                    
                    <span v-else class="title-text">{{ task.title }}</span>
                </div>
                
                <div class="tags-container">
                    <pv-tag :value="'#' + task.id" severity="secondary" rounded></pv-tag>
                    <pv-tag v-if="userRole === 'admin'" value="Admin" severity="danger" rounded></pv-tag>
                </div>
            </div>
        </template>

        <template #content>
            <div class="action-bar">
                <pv-button 
                    v-if="isEditing" 
                    icon="pi pi-check" 
                    class="p-button-rounded p-button-success p-button-text" 
                    @click.stop="saveEdit" 
                />
                <pv-button 
                    v-else 
                    icon="pi pi-pencil" 
                    class="p-button-rounded p-button-secondary p-button-text" 
                    @click.stop="startEdit" 
                />

                <pv-button 
                    v-if="userRole === 'admin'" 
                    icon="pi pi-trash" 
                    class="p-button-rounded p-button-danger p-button-text" 
                    @click.stop="$emit('delete-task', task.id)" 
                />
            </div>
        </template>
    </pv-card>
</template>

<script src="./TaskItem.js"></script>

<style lang="scss" src="./TaskItem.scss" scoped></style>