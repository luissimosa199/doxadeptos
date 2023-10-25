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
          content={image}
        />
      )}
      {image && (
        <meta
          name="twitter:image"
          content={image}
        />
      )}

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
