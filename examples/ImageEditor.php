<?php

namespace App\Livewire\Examples;

use App\Models\Article;
use Livewire\Component;

class ImageEditor extends Component
{
    public Article $article;
    public string $content = '';
    public string $title = '';

    public function mount(Article $article = null)
    {
        $this->article = $article ?? new Article();
        $this->title = $this->article->title ?? '';
        $this->content = $this->article->content ?? '';
    }

    public function save()
    {
        $this->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
        ]);

        $this->article->title = $this->title;
        $this->article->content = $this->content;
        $this->article->save();

        session()->flash('message', 'Article with images saved successfully!');
    }

    public function render()
    {
        return view('examples.image-editor');
    }
}
