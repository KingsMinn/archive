// const pageName = pageProperties.Name.title[0].text.content;

interface NotionText {
  content: string;
}

interface NotionRichTextItem {
  text: NotionText;
}

interface NotionTitle {
  title: NotionRichTextItem[];
}

interface NotionRichText {
  rich_text: NotionRichTextItem[];
}

interface NotionTag {
  name: string;
}

interface NotionMultiSelect {
  multi_select: NotionTag[];
}

interface NotionDateValue {
  start: string;
  end?: string;
}

interface NotionDate {
  date: NotionDateValue;
}

interface NotionFile {
  file: {
    url: string;
  };
}

interface NotionFiles {
  files: NotionFile[];
}

export interface NotionPageProperties {
  Name: NotionTitle;
  Description: NotionRichText;
  Tag: NotionMultiSelect;
  Date: NotionDate;
  Thumbnail: NotionFiles;
}

export interface NotionPageInfo {
  id: string;
  properties: NotionPageProperties;
}

export interface NotionBlock {
  id: string;
  type: string;
  [key: string]: any;
}
