interface disqusResponse {
  code: number;
  response: {
    canVote: boolean;
    createdAt: string;
    dislikes: number;
    editableUntil: string;
    forum: string;
    id: string;
    isApproved: boolean;
    isAtFlagLimit: boolean;
    isDeleted: boolean;
    isDeletedByAuthor: boolean;
    isEdited: boolean;
    isFlagged: boolean;
    isHighlighted: boolean;
    isNewUserNeedsApproval: boolean;
    isSpam: boolean;
    likes: number;
    media: [];
    message: string;
    moderationLabels: [];
    numReports: number;
    parent: any;
    points: number;
    raw_message: string;
    sb: boolean;
    thread: string;
    userScore: number;
    author: any;
  }[];
}

export const cachedComments = defineCachedFunction(
  async () => {
    const response = await $fetch<disqusResponse>(
      "https://disqus.com/api/3.0/forums/listPosts.json?forum=ambrizalofficialsblog&access_token=22b6efc1f0c64597a7e99e19f2f006f8&api_key=SCFtIPrhhoGNzMxZeCcMrKKujyNjJ0uT6l4eCl6cE3EDVebsbKaqUtKaa0VLUkK9"
    );

    return response;
  },
  {
    maxAge: 60 * 15,
    getKey: () => "cached-comments",
  }
);
