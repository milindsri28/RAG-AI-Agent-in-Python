/**
 * Chat export utilities for PDF and Markdown
 */

interface ExportMessage {
    type: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    sources?: string[];
}

/**
 * Export chat as Markdown
 */
export function exportAsMarkdown(filename: string, messages: ExportMessage[]): void {
    let markdown = `# Chat History: ${filename}\n\n`;
    markdown += `**Exported:** ${new Date().toLocaleString()}\n\n`;
    markdown += `---\n\n`;

    messages.forEach((message, index) => {
        const time = message.timestamp.toLocaleString();
        const emoji = message.type === 'user' ? '👤' : '🤖';
        const role = message.type === 'user' ? 'You' : 'AI Assistant';

        markdown += `## ${emoji} ${role}\n`;
        markdown += `*${time}*\n\n`;
        markdown += `${message.content}\n\n`;

        if (message.sources && message.sources.length > 0) {
            markdown += `**Sources:**\n`;
            message.sources.forEach(source => {
                markdown += `- ${source}\n`;
            });
            markdown += `\n`;
        }

        markdown += `---\n\n`;
    });

    // Download the file
    downloadFile(markdown, `${filename}_chat.md`, 'text/markdown');
}

/**
 * Export chat as plain text
 */
export function exportAsText(filename: string, messages: ExportMessage[]): void {
    let text = `Chat History: ${filename}\n`;
    text += `Exported: ${new Date().toLocaleString()}\n`;
    text += `${'='.repeat(60)}\n\n`;

    messages.forEach((message, index) => {
        const time = message.timestamp.toLocaleString();
        const role = message.type === 'user' ? 'You' : 'AI Assistant';

        text += `${role} (${time}):\n`;
        text += `${message.content}\n`;

        if (message.sources && message.sources.length > 0) {
            text += `\nSources:\n`;
            message.sources.forEach(source => {
                text += `- ${source}\n`;
            });
        }

        text += `\n${'-'.repeat(60)}\n\n`;
    });

    downloadFile(text, `${filename}_chat.txt`, 'text/plain');
}

/**
 * Export chat as JSON
 */
export function exportAsJSON(filename: string, messages: ExportMessage[]): void {
    const exportData = {
        document: filename,
        exportedAt: new Date().toISOString(),
        messageCount: messages.length,
        messages: messages.map(msg => ({
            type: msg.type,
            content: msg.content,
            timestamp: msg.timestamp.toISOString(),
            sources: msg.sources || []
        }))
    };

    const json = JSON.stringify(exportData, null, 2);
    downloadFile(json, `${filename}_chat.json`, 'application/json');
}

/**
 * Export chat as HTML (can be printed to PDF)
 */
export function exportAsHTML(filename: string, messages: ExportMessage[]): void {
    let html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chat History: ${filename}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px 20px;
            background: #f5f5f5;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            border-radius: 12px;
            margin-bottom: 30px;
        }
        .header h1 {
            font-size: 28px;
            margin-bottom: 10px;
        }
        .header p {
            opacity: 0.9;
            font-size: 14px;
        }
        .message {
            background: white;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 20px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .message-header {
            display: flex;
            align-items: center;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 1px solid #eee;
        }
        .avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            margin-right: 12px;
        }
        .user-avatar {
            background: #e3f2fd;
        }
        .assistant-avatar {
            background: #f3e5f5;
        }
        .message-info {
            flex: 1;
        }
        .role {
            font-weight: 600;
            font-size: 16px;
            margin-bottom: 2px;
        }
        .timestamp {
            font-size: 12px;
            color: #999;
        }
        .message-content {
            white-space: pre-wrap;
            word-wrap: break-word;
            font-size: 15px;
            line-height: 1.6;
        }
        .sources {
            margin-top: 15px;
            padding-top: 15px;
            border-top: 1px solid #eee;
        }
        .sources-title {
            font-weight: 600;
            font-size: 13px;
            color: #666;
            margin-bottom: 8px;
        }
        .source-item {
            background: #f8f9fa;
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 12px;
            color: #555;
            margin-bottom: 5px;
            font-family: 'Courier New', monospace;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #eee;
            color: #999;
            font-size: 12px;
        }
        @media print {
            body {
                background: white;
                padding: 20px;
            }
            .message {
                box-shadow: none;
                border: 1px solid #eee;
                page-break-inside: avoid;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🤖 Chat History</h1>
        <p>Document: <strong>${filename}</strong></p>
        <p>Exported: ${new Date().toLocaleString()}</p>
        <p>Total Messages: ${messages.length}</p>
    </div>
`;

    messages.forEach(message => {
        const emoji = message.type === 'user' ? '👤' : '🤖';
        const role = message.type === 'user' ? 'You' : 'AI Assistant';
        const avatarClass = message.type === 'user' ? 'user-avatar' : 'assistant-avatar';

        html += `
    <div class="message">
        <div class="message-header">
            <div class="avatar ${avatarClass}">${emoji}</div>
            <div class="message-info">
                <div class="role">${role}</div>
                <div class="timestamp">${message.timestamp.toLocaleString()}</div>
            </div>
        </div>
        <div class="message-content">${escapeHtml(message.content)}</div>`;

        if (message.sources && message.sources.length > 0) {
            html += `
        <div class="sources">
            <div class="sources-title">Sources:</div>`;
            message.sources.forEach(source => {
                html += `
            <div class="source-item">${escapeHtml(source)}</div>`;
            });
            html += `
        </div>`;
        }

        html += `
    </div>`;
    });

    html += `
    <div class="footer">
        <p>Generated by RAG AI Agent</p>
        <p>To save as PDF: Use your browser's Print function (Ctrl+P / Cmd+P) and select "Save as PDF"</p>
    </div>
</body>
</html>`;

    // Open in new window for printing
    const printWindow = window.open('', '_blank');
    if (printWindow) {
        printWindow.document.write(html);
        printWindow.document.close();
    }
}

/**
 * Helper function to download a file
 */
function downloadFile(content: string, filename: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

/**
 * Helper function to escape HTML
 */
function escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

