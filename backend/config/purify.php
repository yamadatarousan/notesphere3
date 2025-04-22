<?php

return [
    'default' => 'default',

    'configs' => [
        'default' => [
            'Core.Encoding' => 'utf-8',
            'HTML.Doctype' => 'HTML 4.01 Transitional',
            'HTML.Allowed' => 'p,br,strong,em,ul,ol,li,h1,h2,h3,code,pre',
            'HTML.ForbiddenElements' => 'script,iframe,object,embed',
            'AutoFormat.AutoParagraph' => false,
            'AutoFormat.RemoveEmpty' => false,
        ],
    ],

    'definitions' => null,

    'serializer' => [
        'driver' => env('CACHE_STORE', env('CACHE_DRIVER', 'file')),
        'cache' => \Stevebauman\Purify\Cache\CacheDefinitionCache::class,
    ],
];