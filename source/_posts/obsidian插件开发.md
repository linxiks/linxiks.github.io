---
title: obsidian插件开发
date: 2025-10-11
type: obsidian
---
##### 左侧工具栏按钮

```ts
const ribbonIconEl = this.addRibbonIcon('dice', 'Sample Plugin', (_evt: MouseEvent) => {
	// Called when the user clicks the icon.
	new Notice('This is a notice!');
});
```

##### 窗口底部添加内容
```ts
const statusBarItemEl = this.addStatusBarItem();
statusBarItemEl.setText('Hexo Tool');
```
##### 创建命令调用
```ts
this.addCommand({
	id: 'open-sample-modal-simple',
	name: 'Open sample modal (simple)',
	callback: () => {
		new SampleModal(this.app).open();
	}
});

// 命令调用中编辑当前文本

this.addCommand({
	id: 'sample-editor-command',
	name: 'Sample editor command',
	editorCallback: (editor: Editor, _view: MarkdownView) => {
		console.log(editor.getSelection());
		editor.replaceSelection('add test');
	}
});
// 命令判断当前条件

this.addCommand({
	id: 'open-sample-modal-complex',
	name: 'Open sample modal (complex)',
	checkCallback: (checking: boolean) => {
		// Conditions to check
		const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
		if (markdownView) {
			// If checking is true, we're simply "checking" if the command can be run.
			// If checking is false, then we want to actually perform the operation.
			if (!checking) {
				new SampleModal(this.app).open();
			}
			// This command will only show up in Command Palette when the check function returns true
			return true;
		}
	}
});

class SampleModal extends Modal {
    constructor(app: App) {
        super(app);
    }
    onOpen() {
        const {contentEl} = this;
        contentEl.setText('Woah!');
    }
    onClose() {
        const {contentEl} = this;
        contentEl.empty();
    }
}
```
##### 设置中添加tab
```ts
// This adds a settings tab so the user can configure various aspects of the plugin
this.addSettingTab(new SampleSettingTab(this.app, this));

class SampleSettingTab extends PluginSettingTab {
    plugin: MyPlugin;
    constructor(app: App, plugin: MyPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }
    display(): void {
        const {containerEl} = this;
        containerEl.empty();
        new Setting(containerEl)
            .setName('Setting #1')
            .setDesc('It\'s a secret')
            .addText(text => text
                .setPlaceholder('Enter your secret')
                .setValue(this.plugin.settings.mySetting)
                .onChange(async (value) => {
                    this.plugin.settings.mySetting = value;
                    await this.plugin.saveSettings();
                }));
    }
}
```
##### 注册监听事件
```ts
this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
	console.log('click', evt);
});
```
##### 注册定时任务
```ts
this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
```
