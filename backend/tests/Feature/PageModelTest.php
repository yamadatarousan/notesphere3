<?php

namespace Tests\Feature;

use App\Models\Page;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PageModelTest extends TestCase
{
    use RefreshDatabase; // テスト後にDBをリセット

    protected function setUp(): void
    {
        parent::setUp();
        // 共通のセットアップ（例：マイグレーション実行）
    }

    public function test_can_create_page()
    {
        // ユーザーを作成
        $user = User::factory()->create();
    
        // ページデータ
        $pageData = [
            'user_id' => $user->id,
            'title' => 'Test Page',
            'content' => 'This is a test page content.',
            'is_public' => false,
        ];
    
        // ページを作成
        $page = Page::create($pageData);
    
        // アサーション
        $this->assertInstanceOf(Page::class, $page);
        $this->assertDatabaseHas('pages', [
            'user_id' => $user->id,
            'title' => 'Test Page',
            'content' => 'This is a test page content.',
        ]);
    }

    public function test_cannot_create_page_without_required_fields()
    {
        $this->expectException(\Illuminate\Database\QueryException::class);
    
        Page::create([
            'user_id' => User::factory()->create()->id,
            // titleを意図的に省略
            'content' => 'Missing title',
        ]);
    }

    public function test_page_can_have_parent_and_children()
    {
        // ユーザーと親ページを作成
        $user = User::factory()->create();
        $parentPage = Page::factory()->for($user)->create(['title' => 'Parent Page']);
    
        // 子ページを作成
        $childPage = Page::factory()->for($user)->create([
            'title' => 'Child Page',
            'parent_id' => $parentPage->id,
        ]);
    
        // 親ページのリレーションを確認
        $this->assertEquals($parentPage->id, $childPage->parent->id);
        $this->assertCount(1, $parentPage->children);
        $this->assertEquals($childPage->id, $parentPage->children->first()->id);
    }

    public function test_can_update_page()
    {
        $page = Page::factory()->for(User::factory()->create())->create([
            'title' => 'Old Title',
        ]);
    
        $page->update(['title' => 'New Title']);
    
        $this->assertDatabaseHas('pages', [
            'id' => $page->id,
            'title' => 'New Title',
        ]);
    }

    public function test_deleting_page_cascades_to_children()
    {
        $user = User::factory()->create();
        $parentPage = Page::factory()->for($user)->create();
        $childPage = Page::factory()->for($user)->create(['parent_id' => $parentPage->id]);
    
        $parentPage->delete();
    
        $this->assertDatabaseMissing('pages', ['id' => $parentPage->id]);
        $this->assertDatabaseMissing('pages', ['id' => $childPage->id]);
    }

    public function test_can_retrieve_user_pages()
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();
        Page::factory()->for($user)->count(2)->create();
        Page::factory()->for($otherUser)->create();
    
        $userPages = Page::where('user_id', $user->id)->get();
    
        $this->assertCount(2, $userPages);
    }

    public function test_authenticated_user_can_create_page()
    {
        $user = User::factory()->create();
        $token = $user->createToken('test-token')->plainTextToken;
    
        $response = $this->withHeaders([
            'Authorization' => "Bearer $token",
        ])->postJson('/api/pages', [
            'title' => 'New Page',
            'content' => 'Page content',
        ]);
    
        $response->assertStatus(201);
        $this->assertDatabaseHas('pages', [
            'user_id' => $user->id,
            'title' => 'New Page',
        ]);
    }

    public function test_authenticated_user_can_retrieve_pages()
    {
        $user = User::factory()->create();
        $token = $user->createToken('test-token')->plainTextToken;
        Page::factory()->count(2)->create(['user_id' => $user->id]);
    
        $response = $this->withHeaders([
            'Authorization' => "Bearer $token",
        ])->getJson('/api/pages');
    
        $response->assertStatus(200)
                 ->assertJsonCount(2);
    }
    
    public function test_authenticated_user_can_update_page()
    {
        $user = User::factory()->create();
        $token = $user->createToken('test-token')->plainTextToken;
        $page = Page::factory()->create(['user_id' => $user->id]);
    
        $response = $this->withHeaders([
            'Authorization' => "Bearer $token",
        ])->putJson("/api/pages/{$page->id}", [
            'title' => 'Updated Title',
            'content' => 'Updated content',
        ]);
    
        $response->assertStatus(200);
        $this->assertDatabaseHas('pages', [
            'id' => $page->id,
            'title' => 'Updated Title',
        ]);
    }
    
    public function test_authenticated_user_cannot_update_other_users_page()
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();
        $token = $user->createToken('test-token')->plainTextToken;
        $page = Page::factory()->create(['user_id' => $otherUser->id]);
    
        $response = $this->withHeaders([
            'Authorization' => "Bearer $token",
        ])->putJson("/api/pages/{$page->id}", [
            'title' => 'Unauthorized Update',
        ]);
    
        $response->assertStatus(403);
    }
    
    public function test_authenticated_user_can_delete_page()
    {
        $user = User::factory()->create();
        $token = $user->createToken('test-token')->plainTextToken;
        $page = Page::factory()->create(['user_id' => $user->id]);
    
        $response = $this->withHeaders([
            'Authorization' => "Bearer $token",
        ])->deleteJson("/api/pages/{$page->id}");
    
        $response->assertStatus(204);
        $this->assertDatabaseMissing('pages', ['id' => $page->id]);
    }
}
