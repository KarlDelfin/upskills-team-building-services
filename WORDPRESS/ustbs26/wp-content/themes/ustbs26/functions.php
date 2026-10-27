<?php

// Fix Gutenberg Code Editor textarea stretching past bottom meta boxes
add_action( 'admin_head', function () {
    ?>
    <style>
        /* Confine the Code Editor textarea and give it an internal scrollbar */
        .editor-post-text-editor {
            max-height: 200px !important;
            overflow-y: auto !important;
            box-sizing: border-box !important;
        }

        /* Ensure the Meta Boxes container (Yoast, Custom CSS) sits neatly below */
        .edit-post-layout__metaboxes {
            margin-top: 2rem !important;
            border-top: 2px solid #ee6b12 !important;
            padding-top: 1rem !important;
        }

        .interface-interface-skeleton__content {
            overflow: auto;
        }
    </style>
    <?php
} );