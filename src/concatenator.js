document.addEventListener('DOMContentLoaded', () => {
    const input1 = document.getElementById('input1');
    const input2 = document.getElementById('input2');
    const outputText = document.getElementById('output-text');
    const separator = document.getElementById('separator');
    const copyBtn = document.getElementById('copy-btn');
    const clearBtn = document.getElementById('clear-btn');
    const combineBtn = document.getElementById('combine-btn');
    const caseButtons = document.querySelectorAll('.case-btn');
    const clearInputButtons = document.querySelectorAll('.clear-input-btn');

    // 각 입력 필드의 현재 대소문자 상태와 원본 텍스트를 저장
    const caseStates = {
        input1: null,
        input2: null
    };
    const originalTexts = {
        input1: '',
        input2: ''
    };

    // 입력 필드 초기화 함수 (텍스트만 지우기)
    const clearInput = (inputId) => {
        const inputElement = document.getElementById(inputId);
        inputElement.value = '';
        originalTexts[inputId] = '';
        // 결과창은 그대로 유지
    };

    // 입력 필드 초기화 버튼 이벤트 처리
    clearInputButtons.forEach(button => {
        button.addEventListener('click', () => {
            const inputId = button.dataset.input;
            clearInput(inputId);
        });
    });

    // 입력 텍스트가 변경될 때마다 결과 업데이트
    const updateOutput = () => {
        let text1 = input1.value.trim();
        let text2 = input2.value.trim();
        const sep = separator.value;
        
        // 현재 적용된 대소문자 변환 적용
        if (caseStates.input1 && caseStates.input1 !== 'original') {
            text1 = convertCase(text1, caseStates.input1);
        }
        if (caseStates.input2 && caseStates.input2 !== 'original') {
            text2 = convertCase(text2, caseStates.input2);
        }
        
        if (!text1 && !text2) {
            outputText.value = '';
            return;
        }

        outputText.value = [text1, text2].filter(text => text).join(sep);
    };

    // 대소문자 변환 함수
    const convertCase = (text, caseType) => {
        switch (caseType) {
            case 'upper':
                return text.toUpperCase();
            case 'lower':
                return text.toLowerCase();
            case 'title':
                return text.toLowerCase().split(' ').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ');
            default:
                return text;
        }
    };

    // 입력 필드 변경 시 원본 텍스트 저장
    input1.addEventListener('input', () => {
        originalTexts.input1 = input1.value;
    });

    input2.addEventListener('input', () => {
        originalTexts.input2 = input2.value;
    });

    // 대소문자 버튼 토글 처리
    caseButtons.forEach(button => {
        button.addEventListener('click', () => {
            const inputId = button.dataset.input;
            const caseType = button.dataset.case;
            const otherButtons = document.querySelectorAll(`.case-btn[data-input="${inputId}"]:not([data-case="${caseType}"])`);
            
            // 같은 버튼을 다시 클릭한 경우 토글 해제
            if (caseStates[inputId] === caseType) {
                button.classList.remove('active');
                caseStates[inputId] = null;
            } else {
                // 다른 버튼들 비활성화
                otherButtons.forEach(btn => btn.classList.remove('active'));
                // 현재 버튼 활성화
                button.classList.add('active');
                caseStates[inputId] = caseType;
            }
        });
    });

    // 합치기 버튼 클릭 시 결과 업데이트
    combineBtn.addEventListener('click', () => {
        updateOutput();
        // 버튼 클릭 효과
        combineBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            combineBtn.style.transform = 'scale(1)';
        }, 100);
    });

    // 구분자 변경 시 자동 업데이트 비활성화
    separator.addEventListener('input', () => {});

    // 결과 복사
    copyBtn.addEventListener('click', () => {
        outputText.select();
        document.execCommand('copy');
        copyBtn.textContent = '복사됨!';
        setTimeout(() => {
            copyBtn.textContent = '결과 복사';
        }, 2000);
    });

    // 모두 지우기 (전체 초기화)
    clearBtn.addEventListener('click', () => {
        // 입력 필드 초기화
        clearInput('input1');
        clearInput('input2');
        // 결과창 초기화
        outputText.value = '';
        // 구분자 초기화
        separator.value = '';
        // 대소문자 버튼 상태 초기화
        caseButtons.forEach(button => button.classList.remove('active'));
        // 원본 버튼 활성화
        document.querySelectorAll('.case-btn[data-case="original"]').forEach(button => {
            button.classList.add('active');
            const inputId = button.dataset.input;
            caseStates[inputId] = 'original';
        });
        input1.focus();
    });

    // 초기 상태 설정: 원본 버튼 활성화
    document.querySelectorAll('.case-btn[data-case="original"]').forEach(button => {
        button.classList.add('active');
        const inputId = button.dataset.input;
        caseStates[inputId] = 'original';
    });
}); 