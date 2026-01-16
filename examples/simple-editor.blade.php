<div class="max-w-4xl mx-auto p-6">
    <h1 class="text-2xl font-bold mb-6">Simple Editor Example</h1>

    @if (session()->has('message'))
        <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {{ session('message') }}
        </div>
    @endif

    <div class="mb-4">
        <livewire:live-lexxy-editor wire:model="content" />
        @error('content') <span class="text-red-500 text-sm">{{ $message }}</span> @enderror
    </div>

    <button 
        wire:click="save" 
        class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
    >
        Save
    </button>
</div>
