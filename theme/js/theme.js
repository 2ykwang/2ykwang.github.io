// 테마 토글 함수
function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    let newTheme;
    if (currentTheme === 'dark') {
        newTheme = 'light';
    } else if (currentTheme === 'light') {
        newTheme = 'dark';
    } else {
        // 시스템 테마와 반대로 설정
        newTheme = systemPrefersDark ? 'light' : 'dark';
    }
    
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Mermaid 테마 업데이트
    updateMermaidTheme();
}

// Mermaid 테마 업데이트 (mermaid-handler.js의 함수 호출)
function updateMermaidTheme() {
    if (typeof window.MermaidHandler !== 'undefined' && typeof window.MermaidHandler.updateTheme === 'function') {
        window.MermaidHandler.updateTheme();
    }
}

// 초기 테마 적용 함수
function applyInitialTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (systemPrefersDark) {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
        }
    }
}

// 페이지 로드 시 즉시 테마 적용 (FOUC 방지)
applyInitialTheme(); 