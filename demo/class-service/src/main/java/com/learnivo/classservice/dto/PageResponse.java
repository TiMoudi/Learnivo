package com.learnivo.classservice.dto;

import org.springframework.data.domain.Page;
import java.util.List;

public class PageResponse<T> {
    private List<T> content;
    private int page;
    private int size;
    private long totalElements;
    private int totalPages;
    private boolean first;
    private boolean last;

    public static <T> PageResponse<T> of(Page<T> pageData) {
        PageResponse<T> r = new PageResponse<>();
        r.content       = pageData.getContent();
        r.page          = pageData.getNumber();
        r.size          = pageData.getSize();
        r.totalElements = pageData.getTotalElements();
        r.totalPages    = pageData.getTotalPages();
        r.first         = pageData.isFirst();
        r.last          = pageData.isLast();
        return r;
    }

    public List<T> getContent()    { return content; }
    public int getPage()           { return page; }
    public int getSize()           { return size; }
    public long getTotalElements() { return totalElements; }
    public int getTotalPages()     { return totalPages; }
    public boolean isFirst()       { return first; }
    public boolean isLast()        { return last; }
}
