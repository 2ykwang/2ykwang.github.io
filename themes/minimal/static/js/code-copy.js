// 코드 블록 복사 기능 (개선된 버전)

document.addEventListener('DOMContentLoaded', function() {
    // 모든 코드 블록에 복사 버튼 추가
    const codeBlocks = document.querySelectorAll('pre:has(code)');
    
    codeBlocks.forEach(function(pre) {
        // Mermaid 다이어그램은 제외
        if (pre.querySelector('.mermaid') || pre.classList.contains('mermaid-converted')) {
            return;
        }
        
        const code = pre.querySelector('code');
        
        // 원본 코드 텍스트 추출 및 저장
        let originalText = getOriginalCodeText(code);
        pre.setAttribute('data-code', originalText);
        
        // 복사 버튼 생성
        const copyButton = document.createElement('button');
        copyButton.textContent = '복사';
        copyButton.className = 'copy-button';
        copyButton.setAttribute('aria-label', '코드 복사');
        
        // 복사 기능
        copyButton.addEventListener('click', async function() {
            const textToCopy = pre.getAttribute('data-code');
            
            try {
                // Clipboard API 사용 (최신 브라우저)
                if (navigator.clipboard && window.isSecureContext) {
                    await navigator.clipboard.writeText(textToCopy);
                    showCopyFeedback(copyButton, '복사됨!');
                } else {
                    // fallback: execCommand (구형 브라우저 지원)
                    const textArea = document.createElement('textarea');
                    textArea.value = textToCopy;
                    textArea.style.position = 'fixed';
                    textArea.style.left = '-999999px';
                    textArea.style.top = '-999999px';
                    document.body.appendChild(textArea);
                    textArea.focus();
                    textArea.select();
                    
                    try {
                        document.execCommand('copy');
                        showCopyFeedback(copyButton, '복사됨!');
                    } catch (err) {
                        showCopyFeedback(copyButton, '실패');
                    }
                    
                    document.body.removeChild(textArea);
                }
            } catch (err) {
                showCopyFeedback(copyButton, '실패');
            }
        });
        
        // 컨테이너 div로 감싸기
        const container = document.createElement('div');
        container.className = 'code-container';
        pre.parentNode.insertBefore(container, pre);
        container.appendChild(pre);
        container.appendChild(copyButton);
    });
});

// 원본 코드 텍스트 추출 (줄바꿈과 들여쓰기 보존)
function getOriginalCodeText(codeElement) {
    // 먼저 innerText 시도 (브라우저가 렌더링한 텍스트, 줄바꿈 보존)
    if (codeElement.innerText) {
        return codeElement.innerText;
    }
    
    // innerText가 없는 경우 수동으로 텍스트 추출
    const clone = codeElement.cloneNode(true);
    
    // 줄 번호 요소 제거
    const lineNumbers = clone.querySelectorAll('.linenos, .linenodiv, .lineno');
    lineNumbers.forEach(el => el.remove());
    
    // <br> 태그를 실제 줄바꿈으로 변환
    clone.innerHTML = clone.innerHTML.replace(/<br\s*\/?>/gi, '\n');
    
    // 블록 레벨 요소들 처리
    const blockElements = clone.querySelectorAll('div, p');
    blockElements.forEach(function(element, index) {
        if (index > 0) {  // 첫 번째가 아닌 경우만 줄바꿈 추가
            element.insertAdjacentText('beforebegin', '\n');
        }
    });
    
    // 최종 텍스트 추출
    let text = clone.textContent || clone.innerText || '';
    
    // 앞뒤 불필요한 공백 제거하되 내부 구조는 보존
    text = text.replace(/^\s+|\s+$/g, '');
    
    // 연속된 공백을 단일 공백으로 변환 (들여쓰기는 보존)
    text = text.replace(/[ \t]+/g, ' ');
    
    return text;
}

// 복사 피드백 표시
function showCopyFeedback(button, message) {
    const originalText = button.textContent;
    button.textContent = message;
    button.classList.add('copied');
    
    setTimeout(function() {
        button.textContent = originalText;
        button.classList.remove('copied');
    }, 1000);
}