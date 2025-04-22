<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Page;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Stevebauman\Purify\Facades\Purify;

class PageController extends Controller
{
    use AuthorizesRequests;

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $pages = auth()->user()->pages()->with('children')->get();
        return response()->json($pages);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'nullable|string',
            'parent_id' => 'nullable|exists:pages,id',
            'is_public' => 'boolean',
        ]);

        // content をサニタイズ
        if (isset($validated['content'])) {
            $validated['content'] = Purify::clean($validated['content']);
        }

        $page = auth()->user()->pages()->create($validated);
        return response()->json($page, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Page $page)
    {
        $this->authorize('view', $page); // 認可チェック（後述）
        return response()->json($page->load('children'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Page $page)
    {
        $this->authorize('update', $page);
    
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'nullable|string',
            'parent_id' => 'nullable|exists:pages,id',
            'is_public' => 'boolean',
        ]);
    
        // 循環参照防止
        if (isset($validated['parent_id']) && $validated['parent_id'] == $page->id) {
            return response()->json(['error' => 'Cannot set page as its own parent'], 422);
        }
    
        // content をサニタイズ
        if (isset($validated['content'])) {
            $validated['content'] = Purify::clean($validated['content']);
        }
    
        $page->update($validated);
        return response()->json($page, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Page $page)
    {
        $this->authorize('delete', $page);
        $page->delete();
        return response()->json(null, 204);
    }
}
