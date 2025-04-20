<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\User;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_access_protected_route()
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $response = $this->get('/api/user');

        $response->assertStatus(200);
        $response->assertJson(['id' => $user->id]);
    }

    public function test_login_returns_token()
    {
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => bcrypt('password'),
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'test@example.com',
            'password' => 'password',
        ]);

        $response->assertStatus(200);
        $response->assertJsonStructure(['token']);
    }
}