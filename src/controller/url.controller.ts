import Url from "../model/url.model";
import { FastifyRequest, FastifyReply } from "fastify";
import * as nanoId from "nanoid";
import * as dotenv from "dotenv";

dotenv.config();

const urlController = {
  async create(req: FastifyRequest) {
    const { url } = req.body as { url: string };

    const findExistingUrl = await Url.find({ originalUrl: url });

    if (findExistingUrl.length) {
      return findExistingUrl;
    }

    const urlId = nanoId.nanoid(4);
    const shortUrl = process.env.ORIGIN + '/short/' + urlId;

    const urlToSave = new Url({
      urlId,
      originalUrl: url,
      shortUrl,
      clicks: 0,
      date: Date.now(),
    });

    await urlToSave.save();

    return urlToSave;
  },

  async redirect(req: FastifyRequest, res: FastifyReply) {
    const { id } = req.params as { id: string };
    const selectedUrl = await Url.findOne({ urlId: id });

    if (selectedUrl) {
      selectedUrl.clicks += 1;
      await selectedUrl.save();

      return res.redirect(selectedUrl.originalUrl);
    }

    return res.redirect(process.env.ORIGIN as string);
  },

  async delete(req: FastifyRequest) {
    const { id } = req.params as { id: string };

    await Url.deleteOne({ urlId: id });

    return { message: "Url successfully deleted" };
  },
};

export default urlController;
