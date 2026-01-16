<div 
    x-data="liveLexxyEditor({
        content: @entangle('content'),
        placeholder: '{{ $placeholder }}',
        toolbar: @js($toolbar),
        enableMarkdown: {{ $enableMarkdown ? 'true' : 'false' }},
        enableCodeHighlighting: {{ $enableCodeHighlighting ? 'true' : 'false' }},
        enableTables: {{ $enableTables ? 'true' : 'false' }},
    })"
    x-init="init()"
    class="live-lexxy-wrapper"
    :class="{ 'required': {{ $required ? 'true' : 'false' }} }"
    wire:ignore
>
    <div class="live-lexxy-toolbar">
        <template x-for="item in toolbar" :key="item">
            <button 
                type="button"
                class="live-lexxy-toolbar-button"
                @click="executeCommand(item)"
                :class="{ 'active': isActive(item) }"
                x-text="getToolbarLabel(item)"
            ></button>
        </template>
    </div>
    
    <div 
        x-ref="editorContainer"
        class="live-lexxy-editor"
    ></div>

    @if($name)
        <input type="hidden" name="{{ $name }}" x-model="content">
    @endif
</div>

@once
    @push('styles')
        <link rel="stylesheet" href="{{ asset('vendor/live-lexxy/live-lexxy.min.css') }}">
    @endpush

    @push('scripts')
        <script src="{{ asset('vendor/live-lexxy/live-lexxy.min.js') }}"></script>
    @endpush
@endonce
