<?php

namespace App\Livewire;

use Livewire\Component;

class SimpleEditor extends Component
{
    public string $content = '';

    public function save()
    {
        $this->validate([
            'content' => 'required|string',
        ]);

        // Your save logic here
        session()->flash('message', 'Content saved successfully!');
    }

    public function render()
    {
        return view('livewire.simple-editor');
    }
}
