document.addEventListener('DOMContentLoaded', () => {
    // DOM 요소들
    const inputText = document.getElementById('input-text');
    const outputText = document.getElementById('output-text');
    const toUpperBtn = document.getElementById('to-upper');
    const toLowerBtn = document.getElementById('to-lower');
    const toTitleBtn = document.getElementById('to-title');
    const toSentenceBtn = document.getElementById('to-sentence');
    const copyBtn = document.getElementById('copy-btn');
    const clearBtn = document.getElementById('clear-btn');
    const moveToInputBtn = document.getElementById('move-to-input');
    const moveToOutputBtn = document.getElementById('move-to-output');

    // 선택된 텍스트 가져오기 함수
    const getSelectedText = () => {
        const start = inputText.selectionStart;
        const end = inputText.selectionEnd;
        const selectedText = inputText.value.substring(start, end);
        return { selectedText, start, end };
    };

    // 텍스트 변환 함수 (선택된 텍스트 또는 전체 텍스트)
    const convertText = (text, converter) => {
        const { selectedText, start, end } = getSelectedText();
        
        if (selectedText) {
            // 선택된 텍스트가 있는 경우
            const convertedSelected = converter(selectedText);
            const beforeText = inputText.value.substring(0, start);
            const afterText = inputText.value.substring(end);
            outputText.value = beforeText + convertedSelected + afterText;
        } else {
            // 선택된 텍스트가 없는 경우 전체 텍스트 변환
            outputText.value = converter(text);
        }
    };

    // 변환 함수들
    const convertToUpper = (text) => text.toUpperCase();
    const convertToLower = (text) => text.toLowerCase();
    const convertToTitle = (text) => {
        return text.toLowerCase().split(' ').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    };
    const convertToSentence = (text) => {
        // 문단을 구분하는 정규식 (빈 줄 또는 줄바꿈으로 구분)
        return text.toLowerCase().split(/\n\s*\n/).map(paragraph => {
            // 각 문단의 첫 글자를 대문자로 변환
            return paragraph.charAt(0).toUpperCase() + paragraph.slice(1);
        }).join('\n\n'); // 문단 사이에 빈 줄 유지
    };

    // 결과 복사 함수
    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(outputText.value);
            showToast('클립보드에 복사되었습니다!');
        } catch (err) {
            showToast('복사에 실패했습니다.', true);
        }
    };

    // 토스트 메시지 표시 함수
    const showToast = (message, isError = false) => {
        const toast = document.createElement('div');
        toast.className = `toast ${isError ? 'error' : 'success'}`;
        toast.textContent = message;
        document.body.appendChild(toast);

        // CSS 스타일 적용
        Object.assign(toast.style, {
            position: 'fixed',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '12px 24px',
            borderRadius: '6px',
            color: 'white',
            backgroundColor: isError ? '#dc3545' : '#28a745',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
            zIndex: '1000',
            transition: 'opacity 0.3s ease'
        });

        // 3초 후 토스트 메시지 제거
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 400);
        }, 1000);
    };

    // 텍스트 이동 함수들
    const moveToInput = () => {
        if (outputText.value.trim()) {
            inputText.value = outputText.value;
            showToast('출력 결과가 입력창으로 이동되었습니다.');
        } else {
            showToast('이동할 텍스트가 없습니다.', true);
        }
    };

    const moveToOutput = () => {
        if (inputText.value.trim()) {
            outputText.value = inputText.value;
            showToast('입력 텍스트가 출력창으로 이동되었습니다.');
        } else {
            showToast('이동할 텍스트가 없습니다.', true);
        }
    };

    // 이벤트 리스너 등록
    toUpperBtn.addEventListener('click', () => {
        convertText(inputText.value, convertToUpper);
    });

    toLowerBtn.addEventListener('click', () => {
        convertText(inputText.value, convertToLower);
    });

    toTitleBtn.addEventListener('click', () => {
        convertText(inputText.value, convertToTitle);
    });

    toSentenceBtn.addEventListener('click', () => {
        convertText(inputText.value, convertToSentence);
    });

    copyBtn.addEventListener('click', copyToClipboard);

    clearBtn.addEventListener('click', () => {
        inputText.value = '';
        outputText.value = '';
        inputText.focus();
    });

    // 입력 필드에서 Enter 키 처리
    inputText.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && e.ctrlKey) {
            e.preventDefault();
            convertText(inputText.value, convertToUpper);
        }
    });

    // 이동 버튼 이벤트 리스너 등록
    moveToInputBtn.addEventListener('click', moveToInput);
    moveToOutputBtn.addEventListener('click', moveToOutput);
}); 