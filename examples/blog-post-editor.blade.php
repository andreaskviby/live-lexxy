<div class="max-w-4xl mx-auto p-6">
    <h1 class="text-3xl font-bold mb-6">Blog Post Editor</h1>

    @if (session()->has('message'))
        <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {{ session('message') }}
        </div>
    @endif

    <div class="space-y-6">
        <div>
            <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
                Title
            </label>
            <input 
                type="text" 
                id="title"
                wire:model="title" 
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter post title..."
            >
            @error('title') <span class="text-red-500 text-sm">{{ $message }}</span> @enderror
        </div>

        <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
                Content
            </label>
            <livewire:live-lexxy-editor 
                wire:model="content"
                placeholder="Write your blog post content here..."
                :required="true"
                :toolbar="$toolbar"
            />
            @error('content') <span class="text-red-500 text-sm">{{ $message }}</span> @enderror
        </div>

        <div class="flex gap-4">
            <button 
                wire:click="save" 
                class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
                Save Post
            </button>
            <a 
                href="/posts" 
                class="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
                Cancel
            </a>
        </div>
    </div>
</div>
