from rest_framework.pagination import PageNumberPagination, LimitOffsetPagination
from rest_framework.response import Response
from collections import OrderedDict


class StandardResultsSetPagination(PageNumberPagination):
    """
    Standard pagination for most views.
    
    Provides page number pagination with customizable page size.
    Includes count, next, previous, and results in response.
    """
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100
    
    def get_paginated_response(self, data):
        return Response(OrderedDict([
            ('count', self.page.paginator.count),
            ('next', self.get_next_link()),
            ('previous', self.get_previous_link()),
            ('results', data)
        ]))


class LargeResultsSetPagination(PageNumberPagination):
    """
    Pagination for views that need to display more items per page.
    
    Useful for admin interfaces or data tables.
    """
    page_size = 50
    page_size_query_param = 'page_size'
    max_page_size = 200


class SmallResultsSetPagination(PageNumberPagination):
    """
    Pagination for views that need to display fewer items per page.
    
    Useful for mobile interfaces or limited space displays.
    """
    page_size = 5
    page_size_query_param = 'page_size'
    max_page_size = 20


class CustomLimitOffsetPagination(LimitOffsetPagination):
    """
    Limit-offset based pagination.
    
    Allows clients to specify both the limit of results per page
    and the offset from the start of the result set.
    """
    default_limit = 10
    max_limit = 100
    limit_query_param = 'limit'
    offset_query_param = 'offset'
    
    def get_paginated_response(self, data):
        return Response(OrderedDict([
            ('count', self.count),
            ('next', self.get_next_link()),
            ('previous', self.get_previous_link()),
            ('results', data)
        ]))
