/*
 * @Author: hotaru biyuehuya@gmail.com
 * @Blog: https://hotaru.icu
 * @Date: 2023-07-18 14:16:10
 * @LastEditors: hotaru biyuehuya@gmail.com
 * @LastEditTime: 2023-07-31 16:53:32
 */
import { existsSync, readFileSync } from 'fs';
import path from 'path';
import Express from 'express';
import { CONST } from '@/tools';
import { con, handle, verify } from '../method';

const route = Express.Router();

route.get('/file', (req, res) => {
	if (verify(<string>req.query.token)) {
		handle(res, null, 504);
		return;
	}
	let { path: paths } = req.query;
	const { op } = req.query;
	if (!paths || typeof paths !== 'string' || !op) {
		handle(res, null, 501);
		return;
	}
	if (paths.includes('..')) {
		handle(res, null, 504);
		return;
	}
	paths = path.join(CONST.PLUGIN_PATH, paths);
	if (!existsSync(paths)) {
		handle(res, null, 502);
		return;
	}

	try {
		handle(res, { content: readFileSync(paths).toString() });
	} catch (error) {
		con.error(error);
		handle(res, null, 503);
	}
});

export default route;
