/**
 * 将 claude web api 返回格式转为正常文本内容
 */
export function formatConversion(result: any) {
   try {
        let content: string = '';
        const lines = result.split("\n\n");
        lines.map((line) => line.replace(/^data: /, "").trim())
            .filter((line) => line !== "")
            .forEach((line) => {
                const te = JSON.parse(line);
                content += te.completion ? te.completion : '';
        });
        return content;
   } catch(err: any) {
        throw new Error(result.error.message);
   }

}