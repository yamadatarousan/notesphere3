<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Page extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', // 作成者（認証済みユーザー）
        'title',  // ページタイトル
        'content', // ページ内容（JSONやテキスト）
        'parent_id', // 階層構造用（親ページのID、null可）
        'is_public', // 公開/非公開フラグ
        'created_at',
        'updated_at',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function parent()
    {
        return $this->belongsTo(Page::class, 'parent_id');
    }
    
    public function children()
    {
        return $this->hasMany(Page::class, 'parent_id');
    }

}