@extends('layouts.public')

@section('title', 'Admin Login')

@section('content')
<div class="container mx-auto px-6 py-12">
    <div class="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 class="text-2xl font-bold text-gray-800 mb-6">Admin Login</h1>
        <form method="POST" action="/admin/login">
            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" name="email" class="mt-1 block w-full p-2 border border-gray-300 rounded-md" required>
            </div>
            <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700">Password</label>
                <input type="password" name="password" class="mt-1 block w-full p-2 border border-gray-300 rounded-md" required>
            </div>
            <button type="submit" class="w-full bg-blue-600 text-white p-3 rounded-md font-semibold hover:bg-blue-700">Login</button>
        </form>
    </div>
</div>
@endsection
