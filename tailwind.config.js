/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class', // Use class-based dark mode to match your .dark class
    theme: {
        extend: {
            colors: {
                // Text colors
                text: 'var(--text)',
                muted: 'var(--muted)',
                warning: 'var(--warning)',
                access: 'var(--access)',
                success: 'var(--success)',
                critical: 'var(--critical)',
                contrast: 'var(--contrast)',
                icon: 'var(--icon)',

                // Background colors
                background: 'var(--background)',
                'background-content': 'var(--background-content)',
                'background-login': 'var(--background-login)',

                // Button backgrounds
                'background-primary': 'var(--background-primary)',
                'hover-background-primary': 'var(--hover-background-primary)',
                'hover-text-primary': 'var(--hover-text-primary)',
                'background-secondary': 'var(--background-secondary)',
                'hover-background-secondary': 'var(--hover-background-secondary)',
                'hover-text-secondary': 'var(--hover-text-secondary)',
                'background-access': 'var(--background-access)',
                'hover-background-access': 'var(--hover-background-access)',
                'hover-text-access': 'var(--hover-text-access)',
                'background-critical': 'var(--background-critical)',
                'hover-background-critical': 'var(--hover-background-critical)',
                'hover-text-critical': 'var(--hover-text-critical)',

                'background-success': 'var(--background-success)',
                'background-warning': 'var(--background-warning)',
                'background-tag': 'var(--background-tag)',
                'background-table-hero': 'var(--background-table-hero)',

                // Other colors
                purple: 'var(--purple)',
                pink: 'var(--pink)',
                orange: 'var(--orange)',
                blue: 'var(--blue)',
                brown: 'var(--brown)',

                // Other backgrounds
                'background-purple': 'var(--background-purple)',
                'background-pink': 'var(--background-pink)',
                'background-orange': 'var(--background-orange)',
                'background-blue': 'var(--background-blue)',
                'background-brown': 'var(--background-brown)',
            },
            fontFamily: {
                montserrat: ['Montserrat', 'sans-serif'],
            },
            fontWeight: {
                bold: 'var(--font-weight-bold)',
                regular: 'var(--font-weight-regular)',
                thin: 'var(--font-weight-thin)',
            },
            fontSize: {
                'lg': 'var(--font-size-large)',
                'base': 'var(--font-size-primary)',
                'sm': 'var(--font-size-secondary)',
                'xs': 'var(--font-size-tertiary)',
                'title': 'var(--font-size-title)',
                'header': 'var(--font-size-header)',
            },
            borderRadius: {
                'xs': 'var(--radius-tiny)',
                'sm': 'var(--radius-small)',
                'DEFAULT': 'var(--radius)',
                'lg': 'var(--radius-large)',
            },
            spacing: {
                'window': 'var(--gap-window)',
                'lg': 'var(--gap-large)',
                'md': 'var(--gap-medium)',
                'DEFAULT': 'var(--gap-standard)',
                'sm': 'var(--gap-small)',
                'xs': 'var(--gap-tiny)',

                'padding-small': 'var(--padding-small)',
                'padding-standard': 'var(--padding-standard)',
                'padding-medium': 'var(--padding-medium)',
                'padding-large': 'var(--padding-large)',
                'outer-border': 'var(--padding-outer-border)',
            },
            gap: {
                'window': 'var(--gap-window)',
                'lg': 'var(--gap-large)',
                'md': 'var(--gap-medium)',
                'DEFAULT': 'var(--gap-standard)',
                'sm': 'var(--gap-small)',
                'xs': 'var(--gap-tiny)',
            },
            padding: {
                'sm': 'var(--padding-small)',
                'DEFAULT': 'var(--padding-standard)',
                'md': 'var(--padding-medium)',
                'lg': 'var(--padding-large)',
                'outer-border': 'var(--padding-outer-border)',
            },
            transitionProperty: {
                'DEFAULT': 'all',
            },
            transitionDuration: {
                'DEFAULT': '150ms',
            },
            transitionTimingFunction: {
                'DEFAULT': 'ease-in-out',
            },
            borderWidth: {
                'thin': '1px',
            },
            width: {
                'main-sidebar': 'var(--main-sidebar-width)',
            },
            height: {
                'checkbox-radio': 'var(--checkbox-radio-size)',
            },
            minHeight: {
                'checkbox-radio': 'var(--checkbox-radio-size)',
            },
        },
    },
    plugins: [],
}