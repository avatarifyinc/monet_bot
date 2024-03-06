import { reactive } from 'vue';

import { defineStore } from 'pinia';

import type { ICommand } from '../models/Command/Command.interface';

export const useDrawingStore = defineStore('drawing-store', () => {
  const undoStack = reactive<ICommand[]>([]);
  const redoStack = reactive<ICommand[]>([]);

  const execute = (command: ICommand) => {
    command.execute();
    undoStack.push(command);
    console.log('execute', undoStack.length, redoStack.length);
    redoStack.length = 0;
  };

  const undo = () => {
    const command = undoStack.pop();

    if (command) {
      command.undo();
      redoStack.push(command);
    }

    console.log('undo', undoStack.length, redoStack.length);
  };

  const redo = () => {
    const command = redoStack.pop();

    if (command) {
      command.execute();
      undoStack.push(command);
    }

    console.log('redo', undoStack.length, redoStack.length);
  };

  const clear = () => {
    undoStack.length = 0;
    redoStack.length = 0;
  };

  return {
    execute,
    undo,
    redo,
    clear,
    stacks: { undoStack, redoStack },
  };
});
