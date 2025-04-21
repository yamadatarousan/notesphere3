<?php

namespace Database\Factories;

use App\Models\Page;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class PageFactory extends Factory
{
    protected $model = Page::class;

    public function definition()
    {
        return [
            'user_id' => User::factory(),
            'title' => $this->faker->sentence(3),
            'content' => $this->faker->paragraph(),
            'parent_id' => null,
            'is_public' => $this->faker->boolean(),
        ];
    }
}
