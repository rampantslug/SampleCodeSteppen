import { DiscoveryTabs } from "modules/myfit/DiscoveryEvents"

export const SearchTabEvents = {
  SEARCH_VIEWED: (tab: DiscoveryTabs) => `${tab}-search-viewed`,
  SEARCH_CLEARED: (tab: DiscoveryTabs) => `${tab}-search-cleared`,
  SEARCH_CLOSED: (tab: DiscoveryTabs) => `${tab}-search-closed`,
  SEARCH_QUERIED: (tab: DiscoveryTabs) => `${tab}-search-queried`,

  SEARCH_TAG_ADDED: (tab: DiscoveryTabs) => `${tab}-search-tag-added`,
  SEARCH_TAG_REMOVED: (tab: DiscoveryTabs) => `${tab}-search-tag-removed`,
  SEARCH_TAG_REMOVED_ALL: (tab: DiscoveryTabs) => `${tab}-search-tag-removed-all`,

  SEARCH_LIST_REFRESHED: (tab: DiscoveryTabs) => `${tab}-list-refreshed`,
  SEARCH_MODAL_TAG_CATEGORIES_VIEWED: (tab: DiscoveryTabs) => `${tab}-search-category-viewed`,
  SEARCH_MODAL_TAG_CATEGORIES_CLOSED: (tab: DiscoveryTabs) => `${tab}-search-category-closed`,

  SEARCH_LOAD_MORE: (tab: DiscoveryTabs) => `${tab}-search-load-more`,
}
