// eventを待ち受け、eventによって処理を振り分ける
async (req, res) => {
    authcheck

    const handler = eventHandlerFactory.create(event);

    const [result, code] = (() => {
        try {
            return [await handler.execute(), 200];
        } catch (err) {
            return [err, 500];
        }
    })();

    return res.status(code).send(result)
}