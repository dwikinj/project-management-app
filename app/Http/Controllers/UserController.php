<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $query = User::query();

        $sortField = request('sort_field','created_at');
        $sortDirection = request('sort_direction','desc');

        if (request('name')) {
            $query->where('name','like','%'. request('name') . '%');
        }

        if (request('email')) {
            $query->where('email','like','%'. request('email') . '%');
        }
        
        $users = $query->orderBy($sortField, $sortDirection)->paginate(10);

        return inertia('User/Index',[
            'users' => UserResource::collection($users),
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return inertia('User/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserRequest $request)
    {
        $data = $request->validated();
        $data['password'] = Hash::make($data['password']);

      
        $user = User::create($data);
        $user->email_verified_at = Carbon::now();
        $user->save();;

    
        return to_route('user.index')->with('success', 'User was created');    
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user)
    {
        return inertia('User/Edit',[
            'user' => new UserResource($user)
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserRequest $request, User $user)
    {
        $data = $request->validated();

        if (isset($data['password'])) {
            if (!Hash::check($data['old_password'], $user->password)) {
                return back()->withErrors([
                    'old_password' => 'Password lama tidak sesuai'
                ]);      }
            $data['password'] = Hash::make($data['password']);
        }

        $user->update($data);

        return to_route('user.index')->with('success', 'User was updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        $isCurrentUser = Auth::id() === $user->id;

        $user->delete();
    
        if ($isCurrentUser) {
            Auth::logout();
            session()->invalidate();
            session()->regenerateToken();
            return redirect()->route('login');
        }
    
        return to_route('user.index');
    }
}
