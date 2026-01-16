<?php

namespace Andreaskviby\LiveLexxy\Livewire;

use Livewire\Component;

class LiveLexxyEditor extends Component
{
    public string $content = '';
    public string $placeholder = 'Start writing...';
    public bool $required = false;
    public array $toolbar = [
        'bold',
        'italic',
        'strikethrough',
        'link',
        'bulletList',
        'orderedList',
        'quote',
        'code',
        'codeBlock',
        'divider',
        'heading',
    ];
    public bool $enableMarkdown = true;
    public bool $enableCodeHighlighting = true;
    public bool $enableTables = true;
    public ?string $name = null;

    protected $listeners = ['liveLexxyContentChanged'];

    public function mount(
        string $content = '',
        string $placeholder = 'Start writing...',
        bool $required = false,
        array $toolbar = null,
        bool $enableMarkdown = true,
        bool $enableCodeHighlighting = true,
        bool $enableTables = true,
        ?string $name = null
    ): void {
        $this->content = $content;
        $this->placeholder = $placeholder;
        $this->required = $required;
        $this->enableMarkdown = $enableMarkdown;
        $this->enableCodeHighlighting = $enableCodeHighlighting;
        $this->enableTables = $enableTables;
        $this->name = $name;

        if ($toolbar !== null) {
            $this->toolbar = $toolbar;
        }
    }

    public function liveLexxyContentChanged($content): void
    {
        $this->content = $content;
    }

    public function render()
    {
        return view('live-lexxy::livewire.live-lexxy-editor');
    }
}
