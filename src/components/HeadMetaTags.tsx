import { TimeLineEntryData } from "@/types";
import { FunctionComponent } from "react";

interface HeadMetaTagsProps {
  image?: string;
  timelineName: string;
  timeLineUrl: string;
  message?: string;
  siteName: string;
}

const HeadMetaTags: FunctionComponent<HeadMetaTagsProps> = ({
  image,
  timelineName,
  timeLineUrl,
  message,
  siteName,
}) => {
  return (
    <>
      {image && (
        <meta
          property="og:image"
          itemProp="image"
          content={image.replace("upload/", `upload/c_scale,h_630,w_1200/`)}
        />
      )}
      {image && (
        <meta
          name="twitter:image"
          content={image.replace("upload/", `upload/c_scale,h_512,w_1024/`)}
        />
      )}

      <meta
        property="og:image:width"
        content="1200"
      />
      <meta
        property="og:image:height"
        content="630"
      />

      <meta
        property="og:url"
        content={`${timeLineUrl}`}
      />
      <meta
        property="og:title"
        content={`${timelineName}`}
      />
      <meta
        name="twitter:title"
        content={`${timelineName}`}
      />
      <meta
        property="og:description"
        content={`${message}`}
      />
      <meta
        name="twitter:description"
        content={`${message}`}
      />
      <meta
        property="og:type"
        content="website"
      />
      <meta
        property="og:image:type"
        content="image/jpeg"
      />
      <meta
        property="og:site_name"
        content={siteName}
      />
    </>
  );
};

export default HeadMetaTags;
