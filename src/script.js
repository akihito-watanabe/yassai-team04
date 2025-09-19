let petStats = {
    motivation: 70,
    coffee: 50,
    overtime: 30,
    level: 1,
    exp: 0,
    name: "新人くん"
};

const petEvolutions = {
    1: { emoji: "🐣", name: "新人くん" },
    2: { emoji: "🐤", name: "中堅さん" },
    3: { emoji: "🐓", name: "ベテランさん" },
    4: { emoji: "🦅", name: "エース" },
    5: { emoji: "👑", name: "マネージャー" }
};

const funnyMessages = [
    "今日もお疲れ様です！",
    "コーヒーが足りません...☕",
    "残業は嫌いじゃないですが、家に帰りたいです",
    "同僚のAさんが気になります💕",
    "今日の会議、寝てました😴",
    "お昼は何にしましょうか？",
    "プルリクエストをレビューしてください！",
    "バグを見つけました...直しますか？",
    "今度飲みに行きませんか？🍻",
    "新しい技術を学びたいです！"
];

function loadGame() {
    const saved = localStorage.getItem('aiColleagueTamagotchi');
    if (saved) {
        petStats = { ...petStats, ...JSON.parse(saved) };
    }
    updateDisplay();
    setInterval(passiveDecay, 30000);
}

function saveGame() {
    localStorage.setItem('aiColleagueTamagotchi', JSON.stringify(petStats));
}

function updateDisplay() {
    document.getElementById('motivation').style.width = petStats.motivation + '%';
    document.getElementById('motivation-value').textContent = petStats.motivation;

    document.getElementById('coffee').style.width = petStats.coffee + '%';
    document.getElementById('coffee-value').textContent = petStats.coffee;

    document.getElementById('overtime').style.width = petStats.overtime + '%';
    document.getElementById('overtime-value').textContent = petStats.overtime;

    const evolution = petEvolutions[petStats.level] || petEvolutions[5];
    document.getElementById('pet').textContent = evolution.emoji;
    document.querySelector('.pet-name').textContent = evolution.name;

    checkEvolution();
    saveGame();
}

function checkEvolution() {
    const totalStats = petStats.motivation + petStats.coffee + petStats.overtime;
    const newLevel = Math.min(5, Math.floor(totalStats / 60) + 1);

    if (newLevel > petStats.level) {
        petStats.level = newLevel;
        const evolution = petEvolutions[newLevel];
        addChatMessage(`🎉 進化しました！ ${evolution.name} になりました！`, 'pet-message');

        document.getElementById('pet').style.animation = 'none';
        setTimeout(() => {
            document.getElementById('pet').style.animation = 'bounce 2s infinite';
        }, 100);
    }
}

function feedCoffee() {
    if (petStats.coffee < 100) {
        petStats.coffee = Math.min(100, petStats.coffee + 20);
        petStats.motivation = Math.min(100, petStats.motivation + 5);
        addChatMessage("☕ ありがとうございます！目が覚めました！", 'pet-message');
        updateDisplay();
    } else {
        addChatMessage("もうコーヒーは十分です...カフェイン中毒になりそう😵", 'pet-message');
    }
}

function praise() {
    petStats.motivation = Math.min(100, petStats.motivation + 15);
    const messages = [
        "👏 ありがとうございます！頑張ります！",
        "😊 褒められると嬉しいです！",
        "🌟 やる気が出てきました！",
        "💪 もっと頑張ります！"
    ];
    addChatMessage(messages[Math.floor(Math.random() * messages.length)], 'pet-message');
    updateDisplay();
}

function giveOvertime() {
    if (petStats.overtime < 100) {
        petStats.overtime = Math.min(100, petStats.overtime + 25);
        petStats.motivation = Math.max(0, petStats.motivation - 10);
        petStats.coffee = Math.max(0, petStats.coffee - 15);

        const messages = [
            "💼 はい...残業します...",
            "😰 また残業ですか...",
            "⏰ 終電に間に合うかな...",
            "💻 コードを書き続けます..."
        ];
        addChatMessage(messages[Math.floor(Math.random() * messages.length)], 'pet-message');
        updateDisplay();
    } else {
        addChatMessage("💀 もう限界です...労基に通報します", 'pet-message');
    }
}

function chat() {
    const message = funnyMessages[Math.floor(Math.random() * funnyMessages.length)];
    addChatMessage(message, 'pet-message');

    if (Math.random() < 0.3) {
        setTimeout(() => {
            addChatMessage("(小声) 実は転職を考えています...", 'pet-message');
        }, 2000);
    }
}

function sendMessage() {
    const input = document.getElementById('userInput');
    const message = input.value.trim();

    if (message) {
        addChatMessage(`あなた: ${message}`, 'user-message');
        input.value = '';

        setTimeout(() => {
            respondToUser(message);
        }, 1000);
    }
}

function respondToUser(userMessage) {
    let response = "";

    if (userMessage.includes('コーヒー') || userMessage.includes('☕')) {
        response = "コーヒーですね！私も大好きです！☕";
        petStats.coffee = Math.min(100, petStats.coffee + 5);
    } else if (userMessage.includes('残業') || userMessage.includes('仕事')) {
        response = "仕事の話ですか...😅 程々にしましょうね";
        petStats.overtime = Math.min(100, petStats.overtime + 5);
    } else if (userMessage.includes('頑張') || userMessage.includes('応援')) {
        response = "応援ありがとうございます！💪 やる気が出ます！";
        petStats.motivation = Math.min(100, petStats.motivation + 10);
    } else {
        const responses = [
            "そうですね！同感です！",
            "面白いですね〜😊",
            "なるほど、勉強になります！",
            "私もそう思います！",
            "それは素晴らしいアイデアですね！"
        ];
        response = responses[Math.floor(Math.random() * responses.length)];
    }

    addChatMessage(response, 'pet-message');
    updateDisplay();
}

function addChatMessage(message, className) {
    const chatLog = document.getElementById('chatLog');
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${className}`;
    messageDiv.textContent = message;

    chatLog.appendChild(messageDiv);
    chatLog.scrollTop = chatLog.scrollHeight;
}

function passiveDecay() {
    petStats.motivation = Math.max(0, petStats.motivation - 2);
    petStats.coffee = Math.max(0, petStats.coffee - 3);
    petStats.overtime = Math.max(0, petStats.overtime - 1);

    if (petStats.motivation < 20) {
        addChatMessage("😔 やる気が出ません...", 'pet-message');
    }

    if (petStats.coffee < 10) {
        addChatMessage("😴 眠いです...コーヒーください", 'pet-message');
    }

    updateDisplay();
}

document.getElementById('userInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

document.getElementById('pet').addEventListener('click', function() {
    const surpriseMessages = [
        "😄 くすぐったいです！",
        "🎵 今日は良い日ですね！",
        "🤗 構ってくれてありがとう！",
        "✨ なんだか嬉しいです！"
    ];
    const message = surpriseMessages[Math.floor(Math.random() * surpriseMessages.length)];
    addChatMessage(message, 'pet-message');
    petStats.motivation = Math.min(100, petStats.motivation + 3);
    updateDisplay();
});

window.addEventListener('load', loadGame);