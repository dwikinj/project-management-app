<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Http\Resources\ProjectResource;
use App\Http\Resources\TaskResource;
use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;


class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $query = Task::query();

        $sortField = request('sort_field','created_at');
        $sortDirection = request('sort_direction','desc');

        if (request('name')) {
            $query->where('name','like','%'. request('name') . '%');
        }

        if (request('status')) {
            $query->where('status', request('status'));
        }

        if (request('priority')) {
            $query->where('priority', request('priority'));
        }
        
        $tasks = $query->orderBy($sortField, $sortDirection)->paginate(10);

        return inertia('Task/Index',[
            'tasks' => TaskResource::collection($tasks),
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),

        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        $projectId = $request->query('project_id');
        $project = Project::findOrFail($projectId);
        $users = User::where('id', '!=', Auth::id())->get();
        return inertia('Task/Create', [
            'users' => $users,
            'project' => $project,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTaskRequest $request)
    {
        
        $data = $request->validated();
        $image = $request->file('image_path') ?? null;
        $data['created_by'] = Auth::id();
        $data['updated_by'] = Auth::id();
        
        if ($image) {
            $filename = Str::random(10) . '.' . $image->getClientOriginalExtension();
            // Store the file directly in the 'project' directory
            $data['image_path'] = $image->storeAs('task', $filename, 'public');
        }
        
        Task::create($data);

        return to_route('project.show',$request->project_id)->with('success', 'Task was created');    
    }

    /**
     * Display the specified resource.
     */
    public function show(Task $task)
    {

        return inertia('Task/Show',[
            'task' => new TaskResource($task),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Task $task)
    {
        $users = User::where('id','!=',Auth::id())->get();
        $project = Project::findOrFail($task->project_id);
        return inertia('Task/Edit',[
            "task" => new TaskResource($task),
            "project" => new ProjectResource($project),
            'users' => $users,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTaskRequest $request, Task $task)
    {
        $data = $request->validated();
        $image = $request->file('image_path');
        $data['updated_by'] = Auth::id();

        if ($image) {
            if ($task->image_path) {
                Storage::disk('public')->delete($task->image_path);
            }
            $filename = Str::random(10) . '.' . $image->getClientOriginalExtension();
            $data['image_path'] = $image->storeAs('task', $filename, 'public');
        }else {
            unset($data['image_path']);
        }

        $task->update($data);

        return to_route('task.index')->with('success', 'Task '. '"'. $task->name.'"' .' was updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $task)
    {
        if ($task->image_path) {
            Storage::disk('public')->delete($task->image_path);
        }

        $task->delete();

        return to_route('task.index');
    }
}
