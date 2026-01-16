<!-- resources/views/examples/image-editor.blade.php -->
<div class="max-w-4xl mx-auto p-6">
    <h1 class="text-3xl font-bold mb-6">Image Editor Example</h1>
    
    <div class="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
        <h3 class="font-semibold text-blue-900 mb-2">Image Upload Methods:</h3>
        <ul class="list-disc list-inside text-blue-800 space-y-1">
            <li>Click the 🖼️ button in the toolbar to select an image</li>
            <li>Drag and drop an image file directly into the editor</li>
            <li>Copy an image and paste it (Ctrl+V or Cmd+V) into the editor</li>
        </ul>
    </div>

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
                placeholder="Enter article title..."
            >
            @error('title') <span class="text-red-500 text-sm">{{ $message }}</span> @enderror
        </div>

        <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
                Content (with Image Support)
            </label>
            <livewire:live-lexxy-editor 
                wire:model="content"
                placeholder="Write your article and add images by clicking the 🖼️ button, dragging files, or pasting from clipboard..."
                :required="true"
                :toolbar="['bold', 'italic', 'heading', 'image', 'bulletList', 'orderedList', 'link']"
                :enableImages="true"
            />
            @error('content') <span class="text-red-500 text-sm">{{ $message }}</span> @enderror
        </div>

        <div class="flex gap-4">
            <button 
                wire:click="save" 
                class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
                Save Article
            </button>
        </div>
    </div>

    <div class="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 class="font-semibold text-gray-900 mb-2">Advanced: Custom Upload Handler</h3>
        <p class="text-gray-700 text-sm mb-3">
            For production use, you should implement a custom upload handler to store images on your server
            or cloud storage (S3, Cloudflare R2, etc.) instead of using base64 encoding.
        </p>
        <pre class="bg-gray-900 text-gray-100 p-4 rounded text-xs overflow-x-auto"><code>&lt;div x-data="{
    imageUploadHandler: async (file) => {
        const formData = new FormData();
        formData.append('image', file);
        
        const response = await fetch('/api/upload-image', {
            method: 'POST',
            body: formData,
            headers: {
                'X-CSRF-TOKEN': document.querySelector('meta[name=csrf-token]').content
            }
        });
        
        const data = await response.json();
        return data.url; // Return the uploaded image URL
    }
}">
    &lt;livewire:live-lexxy-editor 
        wire:model="content"
        x-bind:image-upload-handler="imageUploadHandler"
    />
&lt;/div></code></pre>
    </div>
</div>
