<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class TaskController extends Controller
{
    public function index() {
        return Task::all();
    }

    public function store(Request $request) {
        $task = Task::create($request->all());
        return response()->json($task, 201);
    }

    public function show($id) {
        return Task::findOrFail($id);
    }

    public function update(Request $request, $id)
{
    \Log::info('Update Request Data:', $request->all()); // Log the request data

    $task = Task::findOrFail($id);
    \Log::info('Task Before Update:', $task->toArray()); // Log the task before update

    if ($request->has('completed')) {
        $task->completed = $request->input('completed');
    }

    $task->save();
    \Log::info('Task After Update:', $task->toArray()); // Log the task after update

    return response()->json($task);
}


    public function destroy($id) {
        Task::destroy($id);
        return response()->json(['message' => 'Task deleted'], 200);
    }

    public function markAsCompleted($id) {
        $task = Task::find($id);
        if ($task) {
            $task->completed = true;
            $task->save();
            return response()->json(['message' => 'Task marked as completed!']);
        }
        return response()->json(['message' => 'Task not found!'], 404);
    }

}
