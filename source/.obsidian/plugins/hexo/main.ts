import { App, Modal, Notice, Plugin, Platform, FileSystemAdapter , Setting, DataAdapter } from 'obsidian';
import { exec } from 'child_process';

// Remember to rename these classes and interfaces!

interface MyPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	mySetting: 'default'
}

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	async onload() {
		await this.loadSettings();

		if (Platform.isWin) {
			// 左侧工具栏按钮
			const createDoc = this.addRibbonIcon('file-plus', 'Hexo - 创建文档', (_evt: MouseEvent) => {
				new InputModel(this.app, (result) => {
					if (result) {
						const vault = this.app.vault;
						vault.create(`_posts/${result}.md`, createNewFile(result)).then(res => {
							new Notice(`创建成功: ${res}`)
						}).catch(e => {
							new Notice(`创建失败: ${e}`)
						})
					}
				}).open();
			});

			const upload = this.addRibbonIcon('cloud-upload', 'Hexo - 上传', (_evt: MouseEvent) => {
				const vault = this.app.vault;
				const basePath = getFileSystemAdapter(vault.adapter).getBasePath();
				const hexoBasePath = basePath.substring(0, basePath.lastIndexOf('\\'))

				exec('hexo clean && hexo g && hexo d', { cwd: hexoBasePath }, (error, stdout, stderr) => {
					if (error) {
						new Notice(`执行出错: ${error.message}`);
						return;
					}
					if (stderr) {
						new Notice(`stderr: ${stderr}`);
						return;
					}
					new Notice(`上传成功: ${stdout}`);
				});
			});
		}

		const statusBarItemEl = this.addStatusBarItem();
		statusBarItemEl.setText('Hexo Tool');
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

function getFileSystemAdapter(adapter: any) : FileSystemAdapter {
	return adapter
}

function createNewFile(fileName: string) : string {
	const date = new Date()
	return `---
title: ${fileName}
date: ${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}
tags:
---`
}

export class InputModel extends Modal {
  constructor(app: App, onSubmit: (result: string) => void) {
    super(app);
	this.setTitle('创建文档');

	let name = '';
    new Setting(this.contentEl)
      .setName('文件标题')
      .addText((text) =>
        text.onChange((value) => {
          name = value;
        }));

    new Setting(this.contentEl)
      .addButton((btn) =>
        btn
          .setButtonText('创建')
          .setCta()
          .onClick(() => {
            this.close();
            onSubmit(name);
          }));
  }
}