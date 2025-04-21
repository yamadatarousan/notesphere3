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

}
