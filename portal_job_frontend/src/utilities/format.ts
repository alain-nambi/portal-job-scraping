export const formatDate = (date: string): string => {
  return date.trim().replace(/\n/g, '-');
};

export const uniqueFileName = (): string => {
  const datetime = new Date().toISOString().split("T");
  const date = datetime[0].replace("-", "_");
  const time = datetime[1].split(".")[0].replace(":", "_");
  const milliseconds = datetime[1].split(".")[1].replace("Z", "");
  return `WEBDEV_${date}_${time}_${milliseconds}.pdf`;
};

export const isNumberedPoint = (plainText: string): boolean => {
  return Number.isInteger(parseInt(plainText.trim()));
};

export const formatBulletedList = (plainText: string): string => {
  try {
    if (plainText) {
      return plainText
        .replace(/•/g, "\n•")
        .replace(/-/g, "\n-")
        .replace(/_/g, "\n_")
    }
    return "";
  } catch (error: any) {
    console.error("Error on formatting bulleted list", error.message);
    throw error;
  }
};

export const formatNumberedList = (plainText: string) => {
  try {
    if (plainText) {
      const formattedBulletedList = formatBulletedList(plainText);
      const lines = Array.from(formattedBulletedList);
      const newLines = lines.map((line, index) => {
        if (
          isNumberedPoint(line) &&
          (lines[index + 1] === "." ||
            lines[index + 1] === ")" ||
            lines[index + 1] === "-")
        ) {
          return `\n${line.trim()}`;
        } else {
          return line;
        }
      });
      return newLines.join("");
    }
  } catch (error: any) {
    console.error("Error on formatting numbered list", error.message);
    throw error;
  }
};
