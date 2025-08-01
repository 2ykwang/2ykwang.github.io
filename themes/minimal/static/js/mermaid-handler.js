// Mermaid 다이어그램 처리 전용 모듈

// Mermaid 초기화 함수
function initializeMermaid() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const theme = isDark ? 'dark' : 'default';
    
    const config = {
        startOnLoad: false,
        theme: theme,
        securityLevel: 'loose'
    };
    
    // 다크테마일 때만 커스텀 색상 적용
    if (isDark) {
        config.themeVariables = {
            darkMode: true,
            primaryColor: '#63b3ed',
            primaryTextColor: '#e0e0e0',
            primaryBorderColor: '#4a5568',
            lineColor: '#4a5568',
            secondaryColor: '#2a2a2a',
            tertiaryColor: '#1a1a1a',
            background: '#1a1a1a',
            surface: '#2a2a2a',
            surfaceBorder: '#4a5568',
            textColor: '#e0e0e0',
            textSecondaryColor: '#a0aec0',
            errorBkgColor: '#742a2a',
            errorTextColor: '#fc8181',
            successBkgColor: '#2a742a',
            successTextColor: '#68d391',
            warningBkgColor: '#744a2a',
            warningTextColor: '#f6ad55',
            infoBkgColor: '#2a4a74',
            infoTextColor: '#63b3ed'
        };
    }
    
    mermaid.initialize(config);
}

// Mermaid 핸들러를 전역으로 노출
window.MermaidHandler = {
    updateTheme: function() {
    const existingMermaid = document.querySelectorAll('.mermaid');
    if (existingMermaid.length === 0) return;
    
    // 각 다이어그램을 새로운 설정으로 다시 생성
    existingMermaid.forEach(function(element) {
        const originalCode = element.getAttribute('data-original-code');
        if (originalCode) {
            const newDiv = document.createElement('div');
            newDiv.className = 'mermaid';
            newDiv.setAttribute('data-original-code', originalCode);
            newDiv.textContent = originalCode;
            element.parentNode.replaceChild(newDiv, element);
        }
    });
    
    initializeMermaid();
    
    setTimeout(function() {
        try {
            if (typeof mermaid.run === 'function') {
                mermaid.run();
            } else {
                mermaid.init();
            }
        } catch (error) {
            console.error('Mermaid 렌더링 오류:', error);
        }
    }, 100);
    }
};

// Mermaid 코드 블록을 자동으로 변환하는 함수
function convertCodeBlocksToMermaid() {
    const codeBlocks = document.querySelectorAll('pre code');
    codeBlocks.forEach(function(block) {
        const text = block.textContent;
        if (text.trim().startsWith('graph') || 
            text.trim().startsWith('sequenceDiagram') || 
            text.trim().startsWith('classDiagram') ||
            text.trim().startsWith('flowchart') ||
            text.trim().startsWith('gantt') ||
            text.trim().startsWith('pie') ||
            text.trim().startsWith('journey')) {
            
            // 이미 변환된 경우 스킵
            if (block.parentElement.parentElement.classList.contains('mermaid-converted')) {
                return;
            }
            
            // 코드 블록을 Mermaid 컨테이너로 변환
            const pre = block.parentElement;
            const highlight = pre.parentElement;
            
            // 새로운 Mermaid 컨테이너 생성
            const mermaidDiv = document.createElement('div');
            mermaidDiv.className = 'mermaid';
            mermaidDiv.textContent = text;
            mermaidDiv.setAttribute('data-original-code', text);
            
            // 기존 코드 블록 교체
            highlight.parentNode.replaceChild(mermaidDiv, highlight);
            mermaidDiv.classList.add('mermaid-converted');
        }
    });
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    // Mermaid가 로드되었는지 확인
    if (typeof mermaid === 'undefined') {
        return;
    }
    
    // 초기 Mermaid 설정
    initializeMermaid();
    
    // 코드 블록을 Mermaid로 변환
    convertCodeBlocksToMermaid();
    
    // Mermaid 렌더링
    try {
        if (typeof mermaid.run === 'function') {
            mermaid.run();
        } else {
            mermaid.init();
        }
    } catch (error) {
        // Mermaid 초기화 실패 시 무시
    }
});