<?php

namespace App\Livewire;

use App\Models\Post;
use Livewire\Component;

class BlogPostEditor extends Component
{
    public Post $post;
    public string $content = '';
    public string $title = '';
    public array $toolbar = [
        'bold',
        'italic',
        'strikethrough',
        'link',
        'heading',
        'bulletList',
        'orderedList',
        'quote',
        'codeBlock',
    ];

    public function mount(Post $post = null)
    {
        $this->post = $post ?? new Post();
        $this->title = $this->post->title ?? '';
        $this->content = $this->post->content ?? '';
    }

    public function save()
    {
        $this->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
        ]);

        $this->post->title = $this->title;
        $this->post->content = $this->content;
        $this->post->save();

        session()->flash('message', 'Post saved successfully!');
    }

    public function render()
    {
        return view('livewire.blog-post-editor');
    }
}
