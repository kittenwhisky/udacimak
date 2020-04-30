import _cliProgress from 'cli-progress';
import fs from 'fs-extra';
import ora from 'ora';
import path from 'path';
import progress from 'progress-stream';
import youtubedl from 'youtube-dl';
import {
  downloadYoutubeSubtitles,
  filenamify,
  findVideoLocalSubtitles,
  logger,
} from '.';


/**
 * Download youtube video and save locally
 * @param {string} videoId Youtube video id to construct download url
 * @param {string} outputPath directory to save the file
 * @param {string} prefix file prefix
 * @param {string} title title of atom
 * @param {string} format youtube-dl quality setting (eg. best)
 */
export default function downloadYoutube(videoId, outputPath, prefix, title, format = '22') {
  return new Promise(async (resolve, reject) => {
    if (!videoId) {
      resolve(null);
      return;
    }

    const filenameBase = `${prefix}. ${filenamify(title || '')}--${videoId}`;
    const filenameYoutube = `${filenameBase}.url`;
    const urlYoutube = `https://www.youtube.com/watch?v=${videoId}`;
    const embedYoutube = `http://www.youtube.com/embed/${videoId}`
    const savePath = path.join(outputPath, filenameYoutube); `${outputPath}/${filenameYoutube}`;

    // avoid re-downloading videos if it already exists
    if (fs.existsSync(savePath)) {
      logger.info(`Video already exists. Skip downloading ${savePath}`);
    } else {
      // save shortcut to youtube
      // code inspired by https://github.com/abertschi/create-url-shortcut
      const htmlPath = `[InternetShortcut]
  URL=${urlYoutube}`;
      fs.writeFileSync(savePath, htmlPath, 'utf8');
    }

    // return youtube videoId for use as src in video.html template
    resolve({
      src: embedYoutube
    })

  }); //.return Promise
}
