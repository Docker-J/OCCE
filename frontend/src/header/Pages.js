let pages;

if (process.env.NODE_ENV === "development") {
  pages = [
    {
      title: "교회소개",
      to: "aboutus#beginning",
    },
    {
      title: "교회소식",
      popupId: "newsPopupState",
      subpages: [
        {
          title: "공지사항",
          to: "announcements",
        },
        {
          title: "주보",
          to: "weeklyupdate",
        },
        {
          title: "새가족",
          to: "newcomers",
        },
        {
          title: "교회사진",
          to: "albums",
        },
        // {
        //   title: "교회영상",
        //   to: "videos",
        // },
      ],
    },
    {
      title: "ON-Line",
      popupId: "onlinePopupState",
      subpages: [
        {
          title: "주일예배",
          to: "online/sundayservice",
        },
        {
          title: "말씀",
          to: "online/sermon",
        },
        {
          title: "찬양",
          to: "online/worship",
        },
        {
          title: "새벽QT",
          to: "online/dawnQT",
        },
        {
          title: "기도ON",
          to: "online/prayON",
        },
        {
          title: "묵상ON",
          to: "online/meditationon",
        },
        {
          title: "291일 성경1독",
          to: "online/bible291",
        },
      ],
    },
    {
      title: "공동체",
      popupId: "communityPopupState",
      subpages: [
        {
          title: "소그룹",
          to: "community/smallgroup",
        },
        {
          title: "사역",
          to: "community/ministry",
        },
      ],
    },
    {
      title: "다음세대",
      popupId: "nextGenPopupState",
      subpages: [
        {
          title: "유아유치부",
          to: "nextgen/preschool",
        },
        {
          title: "유초등부",
          to: "nextgen/elementary",
        },
        {
          title: "중고등부",
          to: "nextgen/youth",
        },
        {
          title: "청년부",
          to: "nextgen/youngadult",
        },
      ],
    },
  ];
} else if (process.env.NODE_ENV === "production") {
  pages = [
    {
      title: "교회소개",
      to: "aboutus#beginning",
    },
    {
      title: "교회소식",
      popupId: "newsPopupState",
      subpages: [
        {
          title: "공지사항",
          to: "announcements",
        },
        {
          title: "주보",
          to: "weeklyupdate",
        },
        {
          title: "새가족",
          to: "newcomers",
        },
        // {
        //   title: "교회사진",
        //   to: "photos",
        // },
        // {
        //   title: "교회영상",
        //   to: "videos",
        // },
      ],
    },
    {
      title: "ON-Line",
      popupId: "onlinePopupState",
      subpages: [
        {
          title: "주일예배",
          to: "online/sundayservice",
        },
        {
          title: "말씀",
          to: "online/sermon",
        },
        {
          title: "찬양",
          to: "online/worship",
        },
        {
          title: "새벽QT",
          to: "online/dawnQT",
        },
        {
          title: "기도ON",
          to: "online/prayON",
        },
        {
          title: "묵상ON",
          to: "online/meditationon",
        },
        {
          title: "291일 성경1독",
          to: "online/bible291",
        },
      ],
    },
    {
      title: "공동체",
      popupId: "communityPopupState",
      subpages: [
        {
          title: "소그룹",
          to: "community/smallgroup",
        },
        {
          title: "사역",
          to: "community/ministry",
        },
      ],
    },
    {
      title: "다음세대",
      popupId: "nextGenPopupState",
      subpages: [
        {
          title: "유아유치부",
          to: "nextgen/preschool",
        },
        {
          title: "유초등부",
          to: "nextgen/elementary",
        },
        {
          title: "중고등부",
          to: "nextgen/youth",
        },
        {
          title: "청년부",
          to: "nextgen/youngadult",
        },
      ],
    },
  ];
}

export default pages;
